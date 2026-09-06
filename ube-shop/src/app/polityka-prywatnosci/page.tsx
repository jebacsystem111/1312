import type { Metadata } from "next";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Prywatność",
  description: "Jakie dane zbiera sklep Purpura i jak długo je trzyma.",
};

export default function Prywatnosc() {
  return (
    <Legal
      title="Prywatność i pliki cookies"
      intro="Zbieramy minimum danych potrzebne do wysłania paczki. Nie sprzedajemy nikomu niczego i nie profilujemy zakupów spożywczych."
      sections={[
        {
          h: "Administrator",
          p: ["Administratorem danych jest Purpura sp. z o.o., kontakt: iod@purpura.pl."],
        },
        {
          h: "Co zbieramy",
          p: [
            "Imię i nazwisko, adres dostawy, e-mail, telefon, historia zamówień, adres IP w momencie złożenia zamówienia.",
            "Podstawa: wykonanie umowy (dostawa paczki) oraz wypełnienie obowiązków rachunkowych. Telefon przekazujemy kurierowi wyłącznie na potrzeby doręczenia.",
          ],
        },
        {
          h: "Jak długo",
          p: [
            "Dane zamówień trzymamy 5 lat, bo tyle wynosi okres przedawnienia roszczeń i obowiązek przechowywania dokumentacji księgowej. Konto i koszyk możesz usunąć samodzielnie, pisząc na iod@purpura.pl.",
          ],
        },
        {
          h: "Pliki cookies",
          p: [
            "Używamy dwóch plików: koszyk w pamięci przeglądarki i sesja. Nie ma pikseli reklamowych ani externalnych analityk w wersji sklepu, którą tu oglądasz.",
            "Jeśli dołożymy analitykę albo reklamy, uzupełnimy ten zapis i baner zgód przed wdrożeniem.",
          ],
        },
        {
          h: "Newsletter",
          p: [
            "Adres zapisujemy po kliknięciu w link potwierdzający, z zapisaną datą i godziną zgody. Rezygnacja działa w każdym mailu, a dane z newslettera usuwamy w 14 dni od wypisania.",
          ],
        },
      ]}
    />
  );
}
