/// <reference types="lucia" />
declare global {
	namespace App {
		  interface Locals {
			  auth: import("lucia").AuthRequest;
		  }
	  }
	  namespace Lucia {
		  type Auth = import("$lib/server/lucia").Auth;
		  type DatabaseUserAttributes = {
			  email: string;
			  first_name: string;
			  last_name: string;
			  role: string;
			  id: string;
			  plan: Plan;
			  level: string;
			  classesRemaining: int;
			  payments: Payment[];
		  };
		  type DatabaseSessionAttributes = {};
	  }
  }
  
  // THIS IS IMPORTANT!!!
  export {};