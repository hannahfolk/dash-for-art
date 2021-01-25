import http from "http";
import { assert, expect } from "chai";

import server from "../api/src/index.js";

describe("Backend express API endpoints", () => {
  it("Hello world", done => {
    http.get("http://127.0.0.1:3001/api/hello-world", res => {
      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });
      res.on("end", () => {
        const parsedData = JSON.parse(rawData);
        expect(parsedData).to.have.property("Hello");
      });
      done();
    });
  });
});
