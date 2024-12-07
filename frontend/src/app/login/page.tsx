"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
  const [data, setData] = useState<{
    email: string,
    password: string
  }>({
    email: '',
    password: ''
  })

  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  // To validate if the fiels email and password are filled
  const isLoginDisabled = !data.email || !data.password;

  const login = async () => {
    try {
      let { data: dataUser, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (dataUser) {
        await syncUserData();
        router.push('/');
      } else if (error) {
        setMessage("Login failed: " + error.message);
      }
      
    } catch (error) {
      setMessage("An error occurred: " + error);
    }
  }

  const syncUserData = async () => {
    try {
      // Fetch the authenticated session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error('No authenticated user found.');
        setMessage('Invalid credentials! Please try again.');
        return;
      }

      const userId = session.user.id;
      // Retrieve role and nif from metadata
      const role = session.user.user_metadata.role || 'Co-Producer';
      const nif = session.user.user_metadata.nif || null;
      const name = session.user.user_metadata.name || null;
      console.log('User data:', { userId, role, nif, name });
      const { data: { user }, error } = await supabase.auth.getUser();     

      // Insert or update the user's data in the `public.user` table
      const { error: insertError } = await supabase
        .from('Users')
        .upsert([
          {
            authuserid: userId,
            email: session.user.email,
            name: name,
            role: role,
            nif: nif,
          },
        ],
        { onConflict: 'email' }
      );

      if (insertError) {
        console.error('Data sync error:', insertError);
        setMessage(`Error syncing user data: ${insertError.message}`);
        return;
      }

      console.log('User data synchronized successfully!');
    } catch (error) {
      console.error('Unexpected error during data sync:', error);
      setMessage(`An error occurred during data sync: ${error}`);
    }
  };


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const sendResetPassword = async () => {
    try {
      const { data: resetData, error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.href}reset`
      });
    } catch (error) {
      setMessage("An error occurred: " + error);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {resetPassword ? "Reset Password" : "Login"}
        </h2>
        <div className="grid mb-4">
          <label className="mb-2 text-gray-300">Email</label>
          <input
            type="text"
            name="email"
            value={data?.email}
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        {!resetPassword && (
          <div className="grid mb-6">
            <label className="mb-2 text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={data?.password}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </div>
        )}
        {message && <div className="mb-4 text-center text-white">{message}</div>}
        <div>
          {resetPassword ? (
            <button
              onClick={sendResetPassword}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Reset Password
            </button>
          ) : (
            <button
              onClick={login}
              disabled={isLoginDisabled}
              className={`w-full ${isLoginDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'} text-white py-2 rounded hover:bg-blue-600 transition duration-200`}
            >
              Login
            </button>
          )}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => setResetPassword(!resetPassword)}
            className="text-blue-400 hover:underline"
          >
            {resetPassword ? "Back to Login" : "Forgot Password?"}
          </button>
        </div>
        {!resetPassword && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-blue-400 hover:underline"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
