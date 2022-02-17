<template>
  <div class="login-container">
    <div class="login">
      <h1>Log in</h1>
      <form method="post">
        <div class="text-field">
          <input type="text" required />
          <span></span>
          <label for="">Username</label>
        </div>
        <div class="text-field">
          <input type="password" required />
          <span></span>
          <label for="">Password</label>
        </div>
        <div class="forgot-pass">
          <span tabindex="0">Forgot Password?</span>
        </div>
        <input type="submit" value="Login" tabindex="0" />
        <div class="sign-up-link">
          Not a member? <a href="#">Sign up</a> or
          <a href="#">Play anonymously</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.login-container {
  z-index: 1;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login {
    background: white;
    border-radius: 5px;
    width: 35%;
    min-width: 350px;
    max-width: min(100vw, 500px);
    h1 {
      text-align: center;
      padding: 1rem 0;
      border-bottom: 2px solid silver;
    }
    form {
      padding: 0 2.5rem;
      .text-field {
        position: relative;
        border-bottom: 3px solid #adadad;
        margin: 2.1rem 0;
        input {
          width: 100%;
          padding: 0 5px;
          height: 2.5rem;
          font-size: 1rem;
          border: none;
          background: none;
          outline: none;
          &:focus ~ label,
          &:valid ~ label {
            top: -5px;
            color: #2691d9;
          }
          &:focus ~ span::before,
          &:valid ~ span::before {
            width: 100%;
          }
        }
        label {
          position: absolute;
          top: 50%;
          left: 5px;
          color: #adadad;
          transform: translateY(-50%);
          pointer-events: none;
          transition: var(--tran-04);
          font-weight: 500;
        }
        span::before {
          content: "";
          position: absolute;
          top: 2.5rem;
          left: 0;
          width: 0%;
          height: 3px;
          background: #2691d9;
          transition: var(--tran-04);
        }
      }
      .forgot-pass {
        margin: 0 0 1.5rem 5px;
        color: #a6a6a6;
        span:hover {
          cursor: pointer;
          text-decoration: underline;
          color: #2691d9;
        }
      }
      input[type="submit"] {
        width: 100%;
        padding-block: 0.75rem;
        border: 0;
        background: #2691d9;
        border-radius: 5px;
        font-size: 1rem;
        color: white;
        font-weight: 700;
        cursor: pointer;
        outline: none;
        &:focus-visible {
          outline: 2px solid #388fe7;
          outline-offset: 2px;
        }
      }
      .sign-up-link {
        margin: 2rem 0;
        text-align: left;
        font-size: 1rem;
        color: #666;
        a {
          color: #2691d9;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>