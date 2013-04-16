/************************ Both ***********************************************/
typeOf = function (value) {
  if (typeof value.typeName === 'function')
    return value.typeName();
  else
    return Object.prototype.toString.call(value);
};

bufferToString = function (buffer) {
  return String.fromCharCode.apply(null, buffer);
};

function Address (value) {
  this.value = value;
}

Address.prototype.get = function () {
  return this.value;
};

person = {
  name: "Chris Mather",

  // EJSON can handle dates out of the box
  createdAt: new Date(),

  // EJSON can handle Uint8Arrays out of the box.
  // This value is just a utf encoded string that
  // says "hello". You can try it out in the browser
  // by typing > bufferToString(person.file)
  file: new Uint8Array([104, 101, 108, 108, 111]),

  // EJSON doesn't know how to serialize and deserialize this
  // value yet
  address: new Address("San Francisco")
};
/*****************************************************************************/

People = new Meteor.Collection("people");

/************************ Client *********************************************/

if (Meteor.isClient) {
  Meteor.subscribe("people");

  uploadPerson = function () {
    // person automatically serialized into EJSON compatible JSON
    // before being sent over the wire
    Meteor.call("uploadPerson", person);
  }
}

/*****************************************************************************/


/************************ Server *********************************************/

if (Meteor.isServer) {
  Meteor.publish("people", function () {
    // person is automatically serialized into EJSON before being sent
    // across the wire where it will be deserialized the the correct
    // date and binary property types
    this.added("people", Meteor.uuid(), person);

    // tell the client we're done sending messages
    this.ready();
  });

  Meteor.methods({
    // person is automatically deserialized from JSON into an EJSON type
    // with dates and binary deserialized into the correct type
    // automatically
    uploadPerson: function (person) {
      console.log("typeOf createdAt: ", typeOf(person.createdAt));
      console.log("typeOf file: ", typeOf(person.file));
    }
  });
}

/*****************************************************************************/
