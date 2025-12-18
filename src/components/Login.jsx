import { auth } from '../firebase'; // We will update firebase.js in a second
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl md:text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tighter">
        LIFE RPG
      </h1>
      
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 flex flex-col items-center gap-6 shadow-2xl">
        <p className="font-mono text-gray-400">Initialize System...</p>
        
        <button 
          onClick={signIn}
          className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
          Login with Google
        </button>
      </div>
    </div>
  );
}