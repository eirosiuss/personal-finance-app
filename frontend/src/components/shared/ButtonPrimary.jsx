const ButtonPrimary = ({ className = "", ...props }) => {
  return (
    <button
      className={`w-full bg-grey-900 preset-4-bold text-white px-4 py-4 rounded-xl cursor-pointer hover:bg-grey-500 ${className}`}
      {...props}
    />
  );
};

export default ButtonPrimary;
