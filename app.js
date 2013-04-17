/************************ Helpers ********************************************/
typeOf = function (value) {
  if (typeof value.typeName === 'function')
    return value.typeName();
  else
    return Object.prototype.toString.call(value);
};

bufferToString = function (buffer) {
  return String.fromCharCode.apply(null, buffer);
};
/*****************************************************************************/

function Address (city, state) {
  this.city = city;
  this.state = state;
}

Address.prototype = {
  constructor: Address,

  toString: function () {
    return this.city + ', ' + this.state;
  },

  // Return a copy of this instance
  clone: function () {
    return new Address(this.city, this.state);
  },

  // Compare this instance to another instance
  equals: function (other) {
    if (!(other instanceof Address))
      return false;

    return EJSON.stringify(this) == EJSON.stringify(other);
  },

  // Return the name of this type which should be the same as the one
  // padded to EJSON.addType
  typeName: function () {
    return "Address";
  },

  // Serialize the instance into a JSON-compatible value. It could
  // be an object, string, or whatever would naturally serialize
  // to JSON
  toJSONValue: function () {
    return {
      city: this.city,
      state: this.state
    };
  }
};

// Tell EJSON about our new custom type
EJSON.addType("Address", function fromJSONValue(value) {
  // the parameter - value - will look like whatever we
  // returned from toJSONValue from above.
  console.log(value);
  return new Address(value.city, value.state);
});

person = {
  name: "Chris Mather",

  createdAt: new Date(),

  file: new Uint8Array([104, 101, 108, 108, 111]),

  address: new Address("San Francisco", "CA")
};

People = new Meteor.Collection("people");

/************************ Client *********************************************/
if (Meteor.isClient) {
  Meteor.subscribe("people");
}
/*****************************************************************************/

/************************ Server *********************************************/
if (Meteor.isServer) {
  Meteor.publish("people", function () {
    this.added("people", Meteor.uuid(), person);
    this.ready();
  });
}
/*****************************************************************************/
