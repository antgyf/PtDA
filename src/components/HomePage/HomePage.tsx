import { useState } from "react";
import AddPatientButton from "./AddPatient/AddPatientButton";
import FindPatientButton from "./FindPatient/FindPatientButton";
import AddPatientBox from "./AddPatient/AddPatientBox";
import FindPatientBox from "./FindPatient/FindPatientBox";
import LogoutButton from "../UI/Button/LogoutButton";
import { useAuth } from "../../hooks/AuthContext";
import Alert from "../UI/Alert";
import { useAlert } from "../../hooks/AlertContext";

const HomePage: React.FC = () => {
  const auth = useAuth();
  const { alert } = useAlert();
  const [addNew, setAddNew] = useState(false);
  const [findPatient, setFindPatient] = useState(false);

  return (
    <div className="min-h-screen w-screen flex flex-col p-4 mt-10 bg-white text-gray-900 dark:bg-white dark:text-gray-900">
      {/* Header Section */}
      <div className="w-full flex flex-row justify-between items-center py-0">
        {alert.message && <Alert />}

        <article className="prose max-lg:prose-h1:text-gray-900 max-lg:dark:prose-h1:text-gray-900">
          <h1>Home Page</h1>
        </article>

        <LogoutButton />
      </div>

      {auth.isSurgeon && (
        <span className="font-bold text-lg text-gray-900 dark:text-gray-900">
          Surgeon ID: {auth.user?.id}
        </span>
      )}

      {/* Content Section */}
      <div className="flex flex-col w-full gap-4 text-gray-900 dark:text-gray-900">
        {!addNew ? (
          <AddPatientButton onButtonClick={() => setAddNew(true)} />
        ) : (
          <AddPatientBox onClose={() => setAddNew(false)} />
        )}

        {!findPatient ? (
          <FindPatientButton onButtonClick={() => setFindPatient(true)} />
        ) : (
          <FindPatientBox onClose={() => setFindPatient(false)} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
