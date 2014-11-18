exports.assertion = function(msg) {

    this.message = msg;
    this.expected = true;

    this.pass = function(value) {
        return true;
    };

    this.value = function(result) {
        return 'bla';
    };

    this.command = function(callback) {
        this.api.title(callback); //TODO: Find out if theres a way to have this custom assertion work without calling the api
        return this;
    };
};