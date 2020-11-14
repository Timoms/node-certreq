# OpenSSL NodeJS (LibOpenSSL)

This package provides a simple interface to the [certreq](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/certreq_1) command.

# Installation &amp; Usage

### Perform basic npm installation task:

```bash
foo@bar: npm install node-certreq --save
```

### Import openssl module:

```javascript
const certreq = require("node-certreq");
```

```javascript
certreq.run(["-submit", "-attrib", "CertificateTemplate XXX"], function (data) {
  // the data object will contain every process output
  console.log(data);
});
```

### The last parameter of the function `run` will always be the callback function.

The Library will call this function with all return values of the process:

> Important: "processError" is not directly a sign of an error, consider hasError as the primary detection. Check [this Article](https://unix.stackexchange.com/questions/131394/why-does-openssl-print-to-stderr-for-a-successful-command) for more information about how openssl for example handles `stderr`. In addition, certreq spawns windows - if the user closes the window without finishing it will result in a process error.

```js
[
  (processError: ""),
  (processOutput: "certreq output"),
  (processExitCode: 0), // <- That's the important one!
  (processEnd: "closed"), // <- Shows how the process exited
  (hasError: false),
];
```

---

That's all that you need to start using it.  
For any information, improvements or bug fixes please contact me.
