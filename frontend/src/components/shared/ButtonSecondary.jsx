const ButtonSecondary = ({ className = "", ...props }) => {
  return (
    <button
      className={`w-full bg-beige-100 preset-4-bold text-grey-900 px-4 py-4 rounded-xl cursor-pointer hover:bg-white hover:text-grey-900 ${className}`}
      {...props}
    />
  );
};

export default ButtonSecondary;
