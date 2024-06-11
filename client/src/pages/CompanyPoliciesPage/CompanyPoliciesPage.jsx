import {
  CancellationPolicy,
  Careers,
  Footer,
  NavBar,
  PrivacyPolicy,
  TermsAndConditions,
} from "../../components";
import "./CompanyPoliciesPage.scss";
import PropTypes from "prop-types";

const CompanyPoliciesPage = ({ activeComponent }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case "PRIVACY-POLICY":
        return <PrivacyPolicy />;
      case "TERMS-AND-CONDITIONS":
        return <TermsAndConditions />;
      case "CANCELLATION-POLICY":
        return <CancellationPolicy />;
      case "CAREERS":
        return <Careers />;
      default:
        return null;
    }
  };

  return (
    <div>
      <NavBar />
      {renderComponent()}
      <Footer />
    </div>
  );
};

CompanyPoliciesPage.propTypes = {
  activeComponent: PropTypes.string.isRequired,
};

export default CompanyPoliciesPage;
