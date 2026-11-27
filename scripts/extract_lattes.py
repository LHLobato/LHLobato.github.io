#!/usr/bin/env python3
"""
Extrator automático de Currículo Lattes (PDF ou XML) em /assets.
Procura automaticamente por arquivos PDF (gerados pelo Lattes) na pasta /assets,
extrai o LattesID, os Artigos Publicados / Trabalhos em Eventos e Vínculos Institucionais,
e grava o resultado em src/data/lattesData.json e public/lattes.json.
"""

import json
import re
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT_DIR / "assets"
PUBLIC_ASSETS_DIR = ROOT_DIR / "public" / "assets"
SRC_JSON_PATH = ROOT_DIR / "src" / "data" / "lattesData.json"
PUBLIC_JSON_PATH = ROOT_DIR / "public" / "lattes.json"
SRC_PROJECTS_MANIFEST_PATH = ROOT_DIR / "src" / "data" / "projectImages.json"
PUBLIC_PROJECTS_MANIFEST_PATH = ROOT_DIR / "public" / "projectImages.json"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"}
PROJECT_DIRS = ["projeto1", "projeto2", "projeto3"]

SECTION_HEADERS = [
    "Biografia",
    "Identificação",
    "Formação acadêmica/titulação",
    "Atuação profissional",
    "Áreas de atuação",
    "Idiomas",
    "Prêmios e títulos",
    "Produções",
    "Artigos completos publicados em periódicos",
    "Trabalhos em eventos",
    "Livros publicados",
    "Capítulos de livros publicados",
    "Participação em eventos, congressos, exposições e feiras",
    "Organização de eventos, congressos, exposições e feiras",
]


def extract_text_from_pdf(pdf_path: Path) -> str:
    result = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        capture_output=True,
        text=True,
        check=True,
    )
    # Remove form feed characters (\x0c) between pages
    return result.stdout.replace("\x0c", "\n")


def get_section_slice(full_text: str, header: str) -> str:
    pattern = re.compile(rf"^{re.escape(header)}\s*$", re.MULTILINE)
    match = pattern.search(full_text)
    if not match:
        return ""
    start_idx = match.end()
    end_idx = len(full_text)

    for other_header in SECTION_HEADERS:
        if other_header == header:
            continue
        other_match = re.compile(
            rf"^{re.escape(other_header)}\s*$", re.MULTILINE
        ).search(full_text, start_idx)
        if other_match and other_match.start() < end_idx:
            end_idx = other_match.start()

    footer_match = re.search(
        r"^Currículo gerado pelo Sistema Currículo Lattes",
        full_text[start_idx:end_idx],
        re.MULTILINE,
    )
    if footer_match:
        end_idx = start_idx + footer_match.start()

    return full_text[start_idx:end_idx].strip()


def parse_numbered_items(section_text: str) -> list[str]:
    if not section_text:
        return []
    # Match numbered entries like "1. LOBATO..." at start of line
    matches = list(re.finditer(r"(?:^|\n)\s*(\d+)\.\s+", section_text))
    items = []
    for idx, m in enumerate(matches):
        start = m.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(section_text)
        raw_item = section_text[start:end].strip()
        # Collapse line breaks into single spaces
        cleaned = re.sub(r"\s+", " ", raw_item).strip()
        if cleaned:
            items.append(cleaned)
    return items


def parse_event_article(raw_entry: str, idx: int) -> dict:
    """
    Formato típico do Lattes PDF para Trabalhos em Eventos:
    AUTORES . TÍTULO. In: NOME DO EVENTO , CIDADE , ANAIS , ANO.
    """
    year_match = re.search(r",\s*(\d{4})\.\s*$", raw_entry)
    year = year_match.group(1) if year_match else ""

    # Separar na cláusula "In:"
    in_split = re.split(r"\.\s*In:\s*", raw_entry, maxsplit=1)
    before_in = in_split[0].strip()
    after_in = in_split[1].strip() if len(in_split) > 1 else ""

    # Separar Autores e Título (o Lattes usa " . " com espaço antes do ponto após a lista de autores)
    author_title_split = re.split(r"\s+\.\s+", before_in, maxsplit=1)
    if len(author_title_split) == 2:
        authors = author_title_split[0].strip()
        title = author_title_split[1].strip().rstrip(".")
    else:
        authors = ""
        title = before_in.rstrip(".")

    # Extrair o nome do evento e local a partir de after_in
    # O Lattes separa os campos com espaço antes da vírgula (" , ")
    event_parts = [p.strip() for p in re.split(r"\s+,\s+", after_in.rstrip("."))]
    if event_parts and re.fullmatch(r"\d{4}", event_parts[-1]):
        event_parts = event_parts[:-1]

    if len(event_parts) >= 2:
        event_name = f"{event_parts[0]} — {event_parts[1]}"
    elif len(event_parts) == 1:
        event_name = event_parts[0]
    else:
        event_name = "Evento Científico"

    return {
        "id": f"lattes-art-{idx}",
        "title": title,
        "event": event_name,
        "year": year,
        "authors": authors,
    }


def parse_experiences(section_text: str) -> list[dict]:
    if not section_text:
        return []
    lines = [line.strip() for line in section_text.splitlines() if line.strip()]
    experiences = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Exemplo: "08/2025 - 08/2026 Bolsista de Iniciação Científica, Carga horária: 20, Bolsista."
        m = re.match(r"^(\d{2}/\d{4}\s*-\s*(?:\d{2}/\d{4}|Atual))\s+(.+)$", line)
        if m:
            period = m.group(1).strip()
            role_raw = m.group(2).strip()
            role_clean = role_raw.split(",")[0].strip()
            desc_lines = []
            i += 1
            while i < len(lines) and not re.match(
                r"^(\d{2}/\d{4}\s*-\s*(?:\d{2}/\d{4}|Atual))\s+", lines[i]
            ):
                desc_lines.append(lines[i])
                i += 1
            description = " ".join(desc_lines).strip()
            experiences.append(
                {
                    "period": period,
                    "title": f"{role_clean} · UNESP / LIPAI",
                    "description": description,
                }
            )
        else:
            i += 1
    return experiences


def sync_project_images() -> None:
    import shutil

    PUBLIC_ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    # Sync root assets images
    for item in ASSETS_DIR.iterdir():
        if item.is_file() and item.suffix.lower() in IMAGE_EXTENSIONS:
            shutil.copy2(item, PUBLIC_ASSETS_DIR / item.name)

    manifest: dict[str, list[str]] = {}
    for proj_dir in PROJECT_DIRS:
        root_proj = ROOT_DIR / proj_dir
        src_proj = ASSETS_DIR / proj_dir
        pub_proj = PUBLIC_ASSETS_DIR / proj_dir
        src_proj.mkdir(parents=True, exist_ok=True)
        pub_proj.mkdir(parents=True, exist_ok=True)

        # Copy from root/projetoX or assets/projetoX to public/assets/projetoX
        if root_proj.exists() and root_proj.is_dir():
            for item in sorted(root_proj.iterdir()):
                if item.is_file() and item.suffix.lower() in IMAGE_EXTENSIONS:
                    shutil.copy2(item, src_proj / item.name)
                    shutil.copy2(item, pub_proj / item.name)

        for item in sorted(src_proj.iterdir()):
            if item.is_file() and item.suffix.lower() in IMAGE_EXTENSIONS:
                shutil.copy2(item, pub_proj / item.name)
        for item in sorted(pub_proj.iterdir()):
            if item.is_file() and item.suffix.lower() in IMAGE_EXTENSIONS:
                target_in_src = src_proj / item.name
                if not target_in_src.exists():
                    shutil.copy2(item, target_in_src)

        images = [
            f"./assets/{proj_dir}/{item.name}"
            for item in sorted(pub_proj.iterdir())
            if item.is_file() and item.suffix.lower() in IMAGE_EXTENSIONS
        ]
        manifest[proj_dir] = images

    formatted_manifest = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    SRC_PROJECTS_MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    SRC_PROJECTS_MANIFEST_PATH.write_text(formatted_manifest, encoding="utf-8")
    PUBLIC_PROJECTS_MANIFEST_PATH.write_text(formatted_manifest, encoding="utf-8")
    print(
        f"[extract_lattes] Imagens sincronizadas para {', '.join(PROJECT_DIRS)}."
    )


def main() -> None:
    sync_project_images()

    pdf_files = sorted(
        ASSETS_DIR.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True
    )
    if not pdf_files:
        print("[extract_lattes] Nenhum PDF encontrado em /assets. Mantendo dados atuais.")
        return

    target_pdf = pdf_files[0]
    print(f"[extract_lattes] Lendo currículo Lattes de: {target_pdf.name}")
    full_text = extract_text_from_pdf(target_pdf)

    lattes_id_match = re.search(r"LattesID\s+(\d+)", full_text)
    lattes_id = lattes_id_match.group(1) if lattes_id_match else target_pdf.stem

    gen_date_match = re.search(
        r"Currículo gerado pelo Sistema Currículo Lattes em\s+([0-9/]+)", full_text
    )
    generated_at = gen_date_match.group(1) if gen_date_match else ""

    eventos_slice = get_section_slice(full_text, "Trabalhos em eventos")
    raw_entries = parse_numbered_items(eventos_slice)
    articles = [
        parse_event_article(entry, idx + 1) for idx, entry in enumerate(raw_entries)
    ]

    atuacao_slice = get_section_slice(full_text, "Atuação profissional")
    experiences = parse_experiences(atuacao_slice)

    payload = {
        "sourceFile": target_pdf.name,
        "lattesId": lattes_id,
        "lattesUrl": f"http://lattes.cnpq.br/{lattes_id}",
        "lastUpdated": generated_at,
        "articles": articles,
        "experiences": experiences,
    }

    SRC_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)

    formatted = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    SRC_JSON_PATH.write_text(formatted, encoding="utf-8")
    PUBLIC_JSON_PATH.write_text(formatted, encoding="utf-8")

    print(
        f"[extract_lattes] Extraídos {len(articles)} artigos e {len(experiences)} vínculos do LattesID {lattes_id}."
    )


if __name__ == "__main__":
    main()
