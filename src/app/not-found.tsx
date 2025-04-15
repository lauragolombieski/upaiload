import Link from "next/link";

export default function NotFound() {
    return(
        <div className="mb-6 text-center">
            <p><strong>Página não escontrada!</strong></p>
            <p>Essa página não existe</p>
            <Link href="/">
                Home
            </Link>
        </div>
    )
}