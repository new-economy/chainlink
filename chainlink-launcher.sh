#!/bin/bash -ex
/opt/intel/sgxpsw/aesm/aesm_service &
chainlink $@
