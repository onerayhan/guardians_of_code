import Header from "../components/Header";
import SettingsBody from "../components/Settings/SettingsBody"
import DeleteUserButton from "../components/Settings/DeleteUserButton";
import SettingsPP from "../components/Settings/SettingsPP";

const Settings = () =>
{
    return (
      <body className="bg-[#081730]">
        <Header />
        <SettingsPP />
        <SettingsBody />
        <DeleteUserButton />
      </body>
    );
};
  
export default Settings;