//////////////////////////////////////////////////////////////////////////////
//
// Support for Verbosity levels for information dense applications.
//   * Debug - Super detail
//   * Verbose – Everything Important
//   * Information - Updates that might be useful to user
//   * Warning - Bad things that happen, but are expected
//   * Error - Errors that are recoverable
//   * Critical - Errors that stop execution
//
//////////////////////////////////////////////////////////////////////////////
const goVerbosityEnum = {
    Lookup: ["Critical", "Error", "Warning", "Information", "Verbose", "Debug"],
    Critical: 0,
    Error: 1,
    Warning: 2,
    Information: 3,
    Verbose: 4,
    Debug: 5
}
var giVerbosity = goVerbosityEnum.Warning;

function MessageLog(Message, Verbosity = goVerbosityEnum.Warning) {
    if (Verbosity <= giVerbosity) {
        switch (Verbosity) {
            case 0:
            case 1:
                console.error(Message);
                break;
            case 2:
                console.warn(Message);
                break;
            case 3:
                console.info(Message);
                break;
            case 4:
            case 5:
                console.debug(Message);
                break;
        }
    }
}