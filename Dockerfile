# Build the SGX enclave and libadapters
FROM baiduxlab/sgx-rust as ebuilder

ADD ./sgx/ /root/sgx/
WORKDIR /root/sgx
ENV CARGO /root/.cargo/bin/cargo
RUN SGX_SIMULATION=yes make

# Build Chainlink in an ubuntu image, to make sure libssl1.0.0 is available
# (it's not available in debian)
FROM ubuntu:16.04 as builder

# We could turn this into a separate image
# + install go + build essentials
RUN apt-get update && apt-get install -y curl git gcc libssl1.0.0 build-essential

RUN cd /usr/local && \
  curl -sS https://dl.google.com/go/go1.10.1.linux-amd64.tar.gz | tar -xz

ENV GOPATH /go
ENV GOROOT /usr/local/go
ENV PATH $GOPATH/bin:$GOROOT/bin:$PATH
RUN mkdir -p $GOPATH/bin && mkdir $GOPATH/src

RUN curl -sS https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
# - install go

ADD . /go/src/github.com/smartcontractkit/chainlink
COPY --from=ebuilder /opt/sgxsdk/lib64/*.so /usr/local/lib/
COPY --from=ebuilder /root/sgx/target/release/libadapters.so /go/src/github.com/smartcontractkit/chainlink/sgx/target/release/
WORKDIR /go/src/github.com/smartcontractkit/chainlink
RUN make build

# Copy Chainlink into a final stage deploy alpine container
FROM ubuntu:16.04

# FIXME: -dev libraries in a release dockerfile? makes me nervous, maybe we
# could statically link our own aesm, it is open source

# + aesm install
RUN apt-get update && apt-get install -y \
  curl \
  libssl-dev \
  libcurl4-openssl-dev \
  libprotobuf-dev \
  kmod \
  libprotobuf-c0-dev \
  libxml2-dev \
  libssl1.0.0

RUN /usr/sbin/useradd aesmd 2>/dev/null

RUN mkdir -p /var/opt/aesmd && chown aesmd.aesmd /var/opt/aesmd
RUN mkdir -p /var/run/aesmd && chown aesmd.aesmd /var/run/aesmd

COPY --from=ebuilder /opt/sgxsdk/lib64/libsgx*.so /usr/lib/
COPY --from=ebuilder /opt/intel/ /opt/intel/
# - aesm install

# + chainlink enclave install
COPY --from=ebuilder /root/sgx/target/release/libadapters.so /usr/lib/
COPY --from=ebuilder /root/sgx/target/release/enclave.signed.so /root/enclave.signed.so
COPY --from=builder /go/src/github.com/smartcontractkit/chainlink/chainlink /root
# - chainlink enclave install

# ./chainlink-launcher.sh script launches aesm in the background then chainlink
WORKDIR /root
COPY ./chainlink-launcher.sh /root
RUN chmod +x ./chainlink-launcher.sh
EXPOSE 6688
ENTRYPOINT ["./chainlink-launcher.sh"]
