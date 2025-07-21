let toExport

switch (process.env.ENV)
{
    case "dev":
        toExport = require("./configs/dev.config")
        break;
    case "preprod":
        toExport = require("./configs/preprod.config")
        break;
    case "prod":
        toExport = require("./configs/prod.config")
        break;
    default:
        toExport = {
            apiDomain: "http://localhost:3000"
        }
}

module.exports = toExport