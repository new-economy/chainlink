# Build the SGX enclave and libadapters
FROM baiduxlab/sgx-rust as ebuilder

ADD ./sgx/ /root/sgx/
WORKDIR /root/sgx
ENV CARGO /root/.cargo/bin/cargo
RUN SGX_SIMULATION=yes make

# Build Chainlink, use stretch to get a libc6 compatible with the sgx-rust image
FROM golang:1.10-stretch as builder

RUN apt-get update && apt-get install -y curl git gcc
RUN curl -sS https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

ADD . /go/src/github.com/smartcontractkit/chainlink
COPY --from=ebuilder /opt/sgxsdk/lib64/*.so /usr/local/lib/
COPY --from=ebuilder /root/sgx/target/release/libadapters.so /go/src/github.com/smartcontractkit/chainlink/sgx/target/release/
WORKDIR /go/src/github.com/smartcontractkit/chainlink
RUN make build

# Copy Chainlink into a final stage deploy alpine container
FROM ubuntu:16.04

RUN apt-get update && apt-get install -y curl libssl-dev libcurl4-openssl-dev libprotobuf-dev kmod libprotobuf-c0-dev libxml2-dev
RUN /usr/sbin/useradd aesmd 2>/dev/null

COPY --from=ebuilder /etc/aesmd.conf /etc/aesmd.conf

RUN mkdir -p /var/opt/aesmd && chown aesmd.aesmd /var/opt/aesmd
RUN mkdir -p /var/run/aesmd && chown aesmd.aesmd /var/opt/aesmd

COPY --from=ebuilder /usr/lib/libsgx_uae_service.so /usr/lib/libsgx_uae_service.so
COPY --from=ebuilder /usr/lib/libsgx_urts.so /usr/lib/libsgx_urts.so

COPY --from=ebuilder /opt/intel/ /opt/intel/

COPY --from=ebuilder /root/sgx/target/release/libadapters.so /usr/lib/
COPY --from=builder /go/src/github.com/smartcontractkit/chainlink/chainlink /usr/bin/
COPY --from=ebuilder /root/sgx/target/release/enclave.signed.so /root

WORKDIR /root
COPY ./chainlink-launcher.sh /root
RUN chmod +x ./chainlink-launcher.sh
EXPOSE 6688
ENTRYPOINT ["./chainlink-launcher.sh"]
