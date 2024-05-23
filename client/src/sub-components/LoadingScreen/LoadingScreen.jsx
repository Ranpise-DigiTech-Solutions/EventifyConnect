import './LoadingScreen.scss';

export default function LoadingScreen() {
  return (
    <div className="loadingScreen__container">
      <div className="overlay"></div>
      <div className="spinner"></div>
    </div>
  )
}
