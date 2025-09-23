import Modal from "./Modal";

export default function LoginModal({ open, onClose }) {
  const titleId = "login-modal-title";
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        {/* Brand mark */}
        <div className="text-sm font-semibold mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-300 ring-1 ring-yellow-400/60">
          RM
        </div>
        <h3 className="text-center text-lg font-semibold">Ride Mate</h3>

        {/* Title */}
        <h2
          id={titleId}
          className="mt-2 text-center text-2xl font-semibold text-slate-900"
        >
          Welcome Back
        </h2>

        {/* Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-800">Email</label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">
              Password
            </label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="mt-2">
              <a
                href="#forgot"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 border border-yellow-500/60 hover:bg-yellow-300"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] text-slate-500">OR CONTINUE WITH</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
            >
              <span className="mr-1.5" aria-hidden="true"></span> Google
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
            >
              <span className="mr-1.5" aria-hidden="true"></span> Facebook
            </button>
          </div>
        </form>

        {/* Bottom links */}
        <p className="mt-5 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <a
            href="#signup"
            className="font-medium text-slate-900 hover:underline"
          >
            Sign up
          </a>
        </p>

        {/* Back link */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            ← Back to home
          </button>
        </div>

        {/* Close (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>
    </Modal>
  );
}
