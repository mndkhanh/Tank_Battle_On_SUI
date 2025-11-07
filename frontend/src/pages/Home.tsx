import Header from "../components/Header";
import WalletStatus from "../components/sui-related/WalletStatus";
import WalletConnect from "../components/sui-related/WalletConnect";

// show header trạng thái đăng nhập,
// show trạng thái ví kết nối
const Home = () => {
  return (
    <>
      <Header />
      <div className="bg-black min-h-screen">
        <WalletConnect />
        <WalletStatus />
      </div>
    </>
  );
};

export default Home;
