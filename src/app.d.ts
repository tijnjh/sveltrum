declare global {
	namespace App {
		interface PageData {
			user: { name: string; email: string; picture: string } | null;
		}
	}
}

export {};
