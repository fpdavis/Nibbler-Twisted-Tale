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
var giVerbosity = goVerbosityEnum.Information;

function MessageLog(Message, Verbosity = goVerbosityEnum.Warning) {
    
    if (Verbosity <= giVerbosity) {
        switch(Verbosity) {
            case goVerbosityEnum.Critical:
                console.error(Message);
                break;
            case goVerbosityEnum.Error:
                console.error(Message);
                break;
            case goVerbosityEnum.Warning:
                console.warn(Message);
                break;
            case goVerbosityEnum.Information:
                console.info(Message);
                break;
            case goVerbosityEnum.Verbose:
                console.info(Message);
                break;
            case goVerbosityEnum.Debug:
                console.debug(Message);
                break;
            default: 
                console.log(Message);
                break;
        }
    }
}