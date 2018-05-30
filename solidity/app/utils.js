module.exports = {
  toWei: function toWei (eth) {
    return (parseInt(eth.toString()) * 10 ** 18).toString()
  }
}
