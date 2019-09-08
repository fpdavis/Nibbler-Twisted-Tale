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
};
var giVerbosity = goVerbosityEnum.Critical;
let iStartTime = new Date().getTime();

function ChangeVerbosity(iIncrement) {
        
    giVerbosity += iIncrement;

    if (giVerbosity < 0) {
        giVerbosity = oVerbosityEnum.Lookup.length - 1;
    }
    else if (giVerbosity >= goVerbosityEnum.Lookup.length) {
        giVerbosity = 0;
    }

    MessageLog(`Changing Verbosity to ` + goVerbosityEnum.Lookup[giVerbosity], goVerbosityEnum.Critical);
    
}

function ResetMessageLogTimer() {
    iStartTime = new Date().getTime();
}

function MessageLog(Message, Verbosity = goVerbosityEnum.Warning) {
    
    if (Verbosity <= giVerbosity) {

        let iCurrentTime = new Date().getTime();
        let iElapsedTime = iCurrentTime - iStartTime;

        Message = "(" + iElapsedTime + "ms) " + Message;

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

        ResetMessageLogTimer();
    }
}