export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*}      data       - Payload to return
   * @param {string} message    - Optional success message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
