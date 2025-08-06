export default function Form(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <div >

        <input
          onChange={props.handleUsernameInput}  // update username state on change
          value={props.username} // controlled input by username state
          type='text'
          placeholder='Username' />

        <input
          onChange={props.handlePasswordInput} // update password state on change
          value={props.password} // controlled input by password state
          type='password'
          placeholder='Password' />
      </div>

      <button>
        {props.submitBtnText}
      </button>
    </form>
  )
}