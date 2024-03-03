from ruamel.yaml import YAML
from generators.document import Document
from generators.pdf import PDF
from os.path import join, dirname
GENERATORS = [
    Document(),
    PDF()
]

def apply_generators(projects, output_folder, lang):
    for generator in GENERATORS:
        generator.create(projects, join(dirname(__file__), output_folder, generator.filename(lang)))

def load_projects_yaml(from_file):
    loader = YAML(typ='safe')
    with open(from_file, "r") as f:
        return loader.load(f)

if __name__ == "__main__":
    for lang in ['de', 'en']:
        cv = load_projects_yaml(f"../projects_{lang}.yaml")
        output_directory = "../"
        apply_generators(cv, output_directory, lang)