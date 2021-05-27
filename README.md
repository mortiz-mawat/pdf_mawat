# PDF Generator Server
This is A PDF server that expects to receive a base64 HTML parameter, convert to a PDF file and send a response with a base64 PDF file.

## Getting started
In order to setup this server, follow the steps below:
* Setup the port in the config.js file, default is 3003.
* Install NODE.JS: https://nodejs.org/en/download/package-manager/
* Open your terminal in the server folder and run "**npm install**"
* Start the server by running "**npm start**"

## Proccess Manager with PM2
PM2 is a proccess manager for NODE.js servers, which responsability is to keep logs of the server and re-start the service if it throws an error. Further documentation is provided at https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/

To install PM2, follow the steps below:
* In your terminal, make sure you don't have the PDF server running.
* Run the command "**npm install pm2 -g**"
* Start the server by running "**pm2 start index.js --name PDF**"

You can check service health by running "**pm2 ls**"
You can check service logs by running "**pm2 logs PDF**"


# Routes

## POST to `/`
```JSON
{
  "base64": "PCFET0NUWVBFIGh0bWw+CjxodG1sPgogICAgPGhlYWQ+CiAgICAgICAgPCEtLSBoZWFkIGRlZmluaXRpb25zIGdvIGhlcmUgLS0+CiAgICA8L2hlYWQ+CiAgICA8Ym9keT4KICAgICAgICA8IS0tIHRoZSBjb250ZW50IGdvZXMgaGVyZSAtLT4KICAgIDwvYm9keT4KPC9odG1sPg==",
  "options": {
    "format": "A4",
    "margin": {
      "bottom": 70,
      "left": 25,
      "right": 35,
      "top": 110
    },
    "printBackground": true
  }
}
```

Bash CURL
```
curl --request POST \
  --url http://localhost:3003/ \
  --header 'Content-Type: application/json' \
  --data '{
  "base64": "PCFET0NUWVBFIGh0bWw+CjxodG1sPgogICAgPGhlYWQ+CiAgICAgICAgPCEtLSBoZWFkIGRlZmluaXRpb25zIGdvIGhlcmUgLS0+CiAgICA8L2hlYWQ+CiAgICA8Ym9keT4KICAgICAgICA8IS0tIHRoZSBjb250ZW50IGdvZXMgaGVyZSAtLT4KICAgIDwvYm9keT4KPC9odG1sPg==",
  "options": {
    "format": "A4",
    "margin": {
      "bottom": 70,
      "left": 25,
      "right": 35,
      "top": 110
    },
    "printBackground": true
  }
}'
```

Expected server response
```JSON
{
  "status": true,
  "result": "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9DcmVhdG9yIChDaHJvbWl1bSkKL1Byb2R1Y2VyIChTa2lhL1BERiBtODApCi9DcmVhdGlvbkRhdGUgKEQ6MjAyMTA1MjcxNzQ3MDUrMDAnMDAnKQovTW9kRGF0ZSAoRDoyMDIxMDUyNzE3NDcwNSswMCcwMCcpPj4KZW5kb2JqCjMgMCBvYmoKPDwvY2EgMQovQk0gL05vcm1hbD4+CmVuZG9iago0IDAgb2JqCjw8L0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbmd0aCAxMTY+PiBzdHJlYW0KeJxVjDEOwlAMQ/ecwjNSAz9J+5MTdKYLB0DQCSTK/SXyfwfAXmwreSwaXTilB/6pboWjRDiuD3pRHaG5TE0QiZFdVZFBeKph2G50OeCZp8pFqqtbh37bHyKhBc3LjD1sKx1nxfqm9lbVENaxdzqnP5LJIpcKZW5kc3RyZWFtCmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRXh0R1N0YXRlIDw8L0czIDMgMCBSPj4+PgovTWVkaWFCb3ggWzAgMCA1OTQuOTU5OTYgODQxLjkxOTk4XQovQ29udGVudHMgNCAwIFIKL1N0cnVjdFBhcmVudHMgMAovUGFyZW50IDUgMCBSPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzIgMCBSXT4+CmVuZG9iago2IDAgb2JqCjw8L1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDUgMCBSPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMzc3IDAwMDAwIG4gCjAwMDAwMDAxNTQgMDAwMDAgbiAKMDAwMDAwMDE5MSAwMDAwMCBuIAowMDAwMDAwNTc3IDAwMDAwIG4gCjAwMDAwMDA2MzIgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDcKL1Jvb3QgNiAwIFIKL0luZm8gMSAwIFI+PgpzdGFydHhyZWYKNjc5CiUlRU9G"
}
```

For additional information on the fields, visit documentation at https://docs.tago.io/en/articles/444-pdf-service-generator
