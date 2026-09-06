import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Zasady sprzedaży w sklepie internetowym Purpura.",
};

export default function Regulamin() {
  return (
    <Legal
      title="Regulamin sklepu"
      intro={`Sprzedaż prowadzimy ze sklepu przy ${site.address}. Poniżej zasady, które obowiązują przy zamawianiu żywności krótko terminowej.`}
      sections={[
        {
          h: "1. Kto sprzedaje",
          p: [
            "Sklep internetowy prowadzi Purpura sp. z o.o. z siedzibą pod adresem podanym w stopce, wpisana do rejestru przedsiębiorców. Kontakt w sprawach zamówień: zamowienia@purpura.pl.",
          ],
        },
        {
          h: "2. Zamówienia i partie",
          p: [
            "Produkty powstają w partiach wtorkowych i piątkowych. Zamówienie złożone do 12:00 w dniu partii trafia do najbliższej wysyłki, po 12:00 do kolejnej.",
            "Stan widoczny w koszyku jest stanem porannym. Jeśli partia skończy się przed spakowaniem Twojej paczki, poinformujemy Cię mailem i zwrócimy kwotę tego produktu w ciągu dwóch dni roboczych.",
          ],
        },
        {
          h: "3. Cena i płatność",
          p: [
            "Ceny zawierają podatek VAT właściwy dla środków spożywczych. Do zamówienia doliczamy koszt dostawy wybrany w kroku składania zamówienia; od wartości wskazanej w sklepie dostawa jest gratis.",
            "Płatności: BLIK, karta, przelew tradycyjny, gotówka kurierowi przy dostawie chłodniczej.",
          ],
        },
        {
          h: "4. Dostawa",
          p: [
            "Paczki z lodami i sandwichami jadą w opakowaniu chłodniczym z żelem chłodzącym. Paczki z halayą i wypiekami nie wymagają łańcucha chłodniczego poniżej 25 stopni.",
            "Reklamacje dotyczące stanu paczki przyjmujemy do 24 godzin od doręczenia, ze zdjęciem opakowania w stanie nieotwartym.",
          ],
        },
        {
          h: "5. Zwrot",
          p: [
            "Prawo odstąpienia od umowy nie dotyczy świadczeń, które ulegają szybkiemu zepsuciu (art. 38 pkt 4 ustawy o prawach konsumenta), czyli naszych produktów spożywczych.",
            "Zwrot możliwy jest w razie uszkodzenia opakowania, niezgodności zamówienia albo wady. W takim wypadku zwracamy pełną kwotę, bez odesłania towaru.",
          ],
        },
        {
          h: "6. Subskrypcja",
          p: [
            "Naliczamy opłatę w dniu partii poprzedzającej wysyłkę. Pominąć wysyłkę lub zakończyć subskrypcję możesz do 5. dnia przed partią, odpowiadając na maila z potwierdzeniem.",
          ],
        },
      ]}
    />
  );
}
