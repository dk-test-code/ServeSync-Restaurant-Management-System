const UnauthorizedPage = () => {
  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <h2>Unauthorized Access</h2>
      <p>You are not authorized to access this page.</p>
    </div>
  );
};

export default UnauthorizedPage;
