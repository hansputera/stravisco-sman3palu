'use server';
import { verval } from "@/libraries/vervalpd";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
    const timeneed = Date.now();
    if (params.id.split('-').filter(x => x.length).length !== 5) {
        return (
            <main>
                <h1 className="text-center text-4xl font-sans font-semibold">
                    ID tidak valid
                </h1>
                <p className="text-center text-wrap font-light">
                    ID yang dimasukkan tidak valid. Silahkan cek kembali ID yang dimasukkan.
                </p>
                <div className="text-center mt-3">
                    <Link href={'/'} className="text-blue-500 hover:underline">Kembali ke halaman utama</Link>
                </div>
            </main>
        )
    }

    const student = await verval.getProfile(params.id).catch(() => undefined);
    if (!student?.name.length) {
        return (
            <main>
                <h1 className="text-center text-4xl font-sans font-semibold">
                    ID tidak ditemukan
                </h1>
                <p className="text-center text-wrap font-light">
                    ID yang dimasukkan tidak ditemukan. Silahkan cek kembali ID yang dimasukkan.
                </p>
                <div className="text-center mt-3">
                    <Link href={'/'} className="text-blue-500 hover:underline">Kembali ke halaman utama</Link>
                </div>
            </main>
        )
    }

    let quotes: string[] = [];
    const responseQuotes = await fetch('https://zenquotes.io/api/quotes').catch(() => undefined);
    if (responseQuotes) {
        const json: {q: string; a: string}[] = await responseQuotes.json();
        quotes = json.map(q => `${q.q} ~ ${q.a}`);
    }

    return (
        <div className="text-center h-screen w-full flex flex-col justify-center items-center">
            <h1 className="text-4xl">
                <span className="font-bold">Selamat</span>, <strong>{student.name}</strong>
            </h1>
            <h2 className="text-2xl text-orange-300 font-semibold">
                ANDA DINYATAKAN <span className="font-bold">LULUS</span>
            </h2>
            <p className="text-sm italic mt-5">
                {quotes.length ? `"${quotes[Math.floor(Math.random() * quotes.length)]}"` : "Terimakasih atas dedikasi selama 3 tahunnya di SMAN 3 Palu, semoga membawa manfaat dan keberkahan"}
            </p>

            <p className="text-sm mt-5 opacity-50">
                nisn check {student.nisn} {Math.floor(Date.now() - timeneed)}ms
            </p>
        </div>
    )
}