
const init = async () => {
    // Generate App Data
    let generateAppDataResponse =  await modules.GenerateAppDataFunction();

    // Login/Logout Text Status Function
    modules.LoginLogoutFunc(generateAppDataResponse);
}

init();