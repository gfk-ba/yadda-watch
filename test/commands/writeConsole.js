exports.command = function(message) {
  console.log(message);
  this.execute(function() { // execute application specific code
      return true;
    },

    function(result) {
    }
  );

  return this; // allows the command to be chained.
};
