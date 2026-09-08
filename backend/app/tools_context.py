import io
from pypdf import PdfReader
import httpx
from bs4 import BeautifulSoup


def extract_pdf_text(pdf_bytes: bytes) -> str:

    """
    Extract text from a PDF.

    Args:
        pdf_bytes: PDF file contents as bytes.

    Returns:
        Extracted text from the PDF.
    """

    pdf_file = io.BytesIO(pdf_bytes)
    reader = PdfReader(pdf_file)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text.strip()



def clean_text(text: str) -> str:
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    return "\n".join(lines)


async def extract_job_description(url: str) -> str:
    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=15,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/139.0.0.0 Safari/537.36"
            )
        },
    ) as client:

        response = await client.get(url)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")


    for element in soup([
        "script",
        "style",
        "nav",
        "footer",
        "header",
        "form",
    ]):
        element.decompose()

    text = clean_text(soup.get_text(separator="\n"))

    # LinkedIn-specific extraction
    start_marker = "Apply"
    end_markers = [
        "Show more"
    ]

    start_index = text.find(start_marker)

    if start_index != -1:
        text = text[start_index + len(start_marker):]

        # Find the earliest end marker
        end_index = len(text)

        for marker in end_markers:
            index = text.find(marker)

            if index != -1:
                end_index = min(end_index, index)

        text = text[:end_index]

    return text.strip()  