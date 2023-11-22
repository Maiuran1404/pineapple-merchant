import Image from "next/image";
import { useRouter } from "next/router";
import pineapple from "~/images/pineapple.png";
import { useUser } from "~/providers/UserProvider";

const SignIn = () => {
  const router = useRouter();
  const { signIn, signOut } = useUser();

  const handleGoogleSignIn = () => {
    signIn()
      .then(() => router.push("/"))
      .catch((err) => console.log(err)); // Redirect to viewer after login
  };

  const handleSignout = () => {
    void signOut();
  };

  return (
    <>
      <div className="flex h-screen flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-16 w-auto"
                src={pineapple}
                alt="Pineaaple logo"
              />
              <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-6 text-sm leading-6 text-gray-500">
                Sign in to your store account. Here you can manage your
                products, store info and more.
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Not a member?{" "}
                <a
                  href="mailto:maiuran1404@gmail.com"
                  className="font-semibold text-gray-900 hover:text-gray-500"
                >
                  Contact us for beta access
                </a>
              </p>
            </div>

            <div className="mt-16">
              <div className="mt-6 ">
                <button
                  onClick={handleGoogleSignIn}
                  title="Click to sign in with google"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-3 py-3 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    className="h-6 w-6"
                    alt="Google logo"
                  />
                  <span className="text-sm font-semibold leading-6">
                    Google Sign In
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;
