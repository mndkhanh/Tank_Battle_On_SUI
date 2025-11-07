import Header from "../components/Header";
import WalletStatus from "../components/sui-related/WalletStatus";
import WalletConnect from "../components/sui-related/WalletConnect";

// show header trạng thái đăng nhập,
// show trạng thái ví kết nối
const Home = () => {
  return (
    <>
      <Header />
      <div className="mt-[20vh]">
        <WalletConnect />
        <WalletStatus />
      </div>
    </>
  );
};

export default Home;
