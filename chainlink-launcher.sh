#!/bin/bash -e

waitForResponse () {
  sleepCount=0
  while [ "$sleepCount" -le "10" ] && ! curl -s "$1"; do
      sleep 1
      sleepCount=$((sleepCount+1))
  done

  if [ "$sleepCount" -gt "10" ]; then
    exit 1
  fi
}

trap "kill -- -$$ || true" SIGINT SIGTERM EXIT

/opt/intel/sgxpsw/aesm/aesm_service &
aesm_pid=$!

waitForResponse http://geth:18546

./chainlink $@ &
chainlink_pid=$!

while sleep 30; do
  if [ $SGX_SIMULATION != yes ]; then
    kill -0 $aesm_pid
  fi
  kill -0 $chainlink_pid
done
