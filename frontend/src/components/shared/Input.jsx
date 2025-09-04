const Input = ({ className, ...props }) => {
  return (
    <input
      className={`preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 ${className}`}
      {...props}
    />
  );
};

export default Input;
