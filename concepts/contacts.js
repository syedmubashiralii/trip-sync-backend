//   Node Working Pattern
//   Request → Event Queue → Event Loop → (Blocking Operation/ Non Blocking Request)
  
//   Non Blocking Request (async) : Execute & Response
//   Blocking Response (sync): Thread Pool(4 workers by default) → Threads(Workers) → Execute & Respond.


const fs = require("fs");

//blocking operation
console.log("Entered blocking operation ");
var res = fs.readFileSync("contacts.txt", "utf-8");
console.log(res);
console.log("Exited blocking operation");

//Non-blocking operation
console.log("Entered non blocking operation");
fs.readFile("contacts.txt", "utf-8", (err, res) => {
  console.log(res);
});

console.log("Exited non blocking operation");
