#!/bin/bash -e
/opt/intel/sgxpsw/aesm/aesm_service &
./chainlink $@
