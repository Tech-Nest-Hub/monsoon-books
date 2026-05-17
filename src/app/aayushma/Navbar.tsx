import Topthinbar from "./Topthinbar";
import Bottomthickbar from "./Bottomthickbar";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50">
      <Topthinbar />
      <Bottomthickbar />
    </div>
  );
};

export default Navbar;