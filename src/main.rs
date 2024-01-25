mod nirnanaaa;
use std::fs;

use genpdf::Alignment;
use genpdf::Element;
use genpdf::Element as _;
use genpdf::Margins;
use genpdf::error::Error;
use genpdf::{elements, style};
use serde::{Serialize, Deserialize};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct FaqSheet {
    title: String,
    values: Vec<String>,
}
#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct Links {
    link: String,
    title: String,
}
#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct PermanentPosition {
    start: String,
    end: String,
    key_points: Vec<String>
}
#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct FreelancePosition {
    start: String,
    end: String,
    key_points: Vec<String>,
    tech: String,
    role: String,
    industry: String,
    client: String,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct Projects {
    introduction: String,
    faq_sheet: Vec<FaqSheet>,
    knowledge_graph: Vec<FaqSheet>,
    links: Vec<Links>,
    permanent_positions: Vec<PermanentPosition>,
    history: Vec<FreelancePosition>,

}
fn main() -> Result<(), Error> {
    let c_reader: Result<Projects, serde_yaml::Error> = match fs::read_to_string("./projects.yaml") {
        Ok(rdr) => {
            let result = serde_yaml::from_str(&rdr);
            result
        },
        Err(e) => panic!("Problem reading file {:?}", e)
    };
    let contents = c_reader.unwrap();
   
    let font_family = genpdf::fonts::from_files("./fonts", "Montserrat", None)
    .expect("Failed to load font family");
    let mut doc = genpdf::Document::new(font_family);

    doc.set_title("Florian Kasper");
    doc.set_minimal_conformance();
    // Customize the pages
    let mut decorator = genpdf::SimplePageDecorator::new();
    decorator.set_margins(Margins::trbl(0, 0, 19, 0));
    decorator.set_header(|page| {
        let mut layout = elements::LinearLayout::vertical();
        let mut tbl = elements::TableLayout::new(vec![1,1,1]);
        tbl.row().element(
            elements::Paragraph::new("info@florian-kasper.com").aligned(Alignment::Center)
                    .styled(style::Style::new().with_font_size(7).with_color(style::Color::Rgb(226, 232, 217)))
        ).element(
            elements::Paragraph::new("+49 1516 7522873").aligned(Alignment::Center)
                    .styled(style::Style::new().with_font_size(7).with_color(style::Color::Rgb(226, 232, 217)))
        ).element(
            elements::Paragraph::new("florian-kasper.com").aligned(Alignment::Center)
                    .styled(style::Style::new().with_font_size(7).with_color(style::Color::Rgb(226, 232, 217)))
        ).push().expect("expected row push to succeed");
        layout.push(
            elements::LinearLayout::vertical().element(
                nirnanaaa::ColoredElement{}
            ).element(
                elements::Paragraph::new("Florian Kasper").aligned(Alignment::Center)
                    .styled(style::Style::new().with_font_size(20).with_color(style::Color::Rgb(242, 183, 5)))
            ).element(
                elements::Paragraph::new("Lead DevOps Engineer").aligned(Alignment::Center)
                    .styled(style::Style::new().with_font_size(13).with_color(style::Color::Rgb(226, 232, 217)))
            ).element(
                tbl.padded(Margins::trbl(4, 0, 0, 0))
            )
        );
        let style = style::Style::new().with_font_size(10).with_color(style::Color::Rgb(255, 0, 0));
        layout.styled(style).padded(Margins::trbl(0, 0, 10, 0))
    });
    doc.set_page_decorator(decorator);

    let mut content_layout = elements::LinearLayout::vertical();
    
    // content_layout;

    content_layout.push(
        elements::Paragraph::new(
            contents.introduction.replace("\n", " "),
        )
        .styled(style::Style::new().with_font_size(9))
        .padded(Margins::trbl(-5, 0, 5, 0))
    );
    let title_style = style::Style::new().with_font_size(16);
    let detail_style = style::Style::new().with_font_size(8);//.with_font_family(fira_sans);


    let mut fact_sheet_table = elements::TableLayout::new(vec![1, 2]);

    for i in contents.faq_sheet {
        let mut joined_str =  elements::LinearLayout::vertical();
        for pos in i.values {
            joined_str.push(
                elements::Paragraph::new(pos).styled(detail_style).padded(Margins::trbl(0, 0, 2, 0))
            )
        }
        fact_sheet_table.row().element(
            elements::Paragraph::new(i.title)
            .styled(style::Style::new().italic().with_font_size(10))
            .padded(Margins::trbl(2, 0, 5, 0)),
        ).element(
            joined_str
            .styled(style::Style::new().italic().with_font_size(8))
            .padded(Margins::trbl(2, 0, 5, 0)),
        )
        .push()
        .expect("Invalid table row");
    }
    content_layout.push(fact_sheet_table.padded(Margins::trbl(5, 0, 0, 0)));

    content_layout.push(elements::PageBreak::new());

    content_layout.push(elements::Paragraph::new(
        "IT-Knowledge",
    ).styled(title_style).padded(Margins::trbl(0, 0, 5, 0)));

    content_layout.push(elements::Paragraph::new(
        "+++ excellent Knowledge, acquired through years of project work",
    ).styled(detail_style));
    content_layout.push(elements::Paragraph::new(
        "++ very good knowledge, acquired through at least one longer project assignment",
    ).styled(detail_style));
    content_layout.push(elements::Paragraph::new(
        "+ basic knowledge, e.g. through prototypes or occasional use",
    ).styled(detail_style));

    let mut knowledge_graph_table = elements::TableLayout::new(vec![1, 2]);

    for i in contents.knowledge_graph {
        let mut joined_str: Vec<String> = vec![];
        for pos in i.values {
            joined_str.push(
                pos
            )
        }
        knowledge_graph_table.row().element(
            elements::Paragraph::new(i.title)
            .styled(style::Style::new().italic().with_font_size(10))
            .padded(Margins::trbl(2, 0, 5, 0)),
        ).element(
            elements::Paragraph::new(joined_str.join(", "))
            .styled(style::Style::new().italic().with_font_size(8))
            .padded(Margins::trbl(2, 0, 5, 0)),
        )
        .push()
        .expect("Invalid table row");
    }
    content_layout.push(knowledge_graph_table.padded(Margins::trbl(5, 0, 0, 0)));
    content_layout.push(elements::PageBreak::new());


    content_layout.push(elements::Paragraph::new(
        "Project History",
    ).styled(title_style));

    let mut table = elements::TableLayout::new(vec![1, 2]);

    for i in contents.history {
        let mut items = elements::UnorderedList::new();
        for pos in i.key_points {
            items.push(
                elements::Paragraph::new(pos).styled(detail_style)
            )
        }
        table.row().element(
            elements::Paragraph::new(format!("{} - {}", i.start, i.end))
            .styled(style::Style::new().italic().with_font_size(10))
        ).element(
            elements::LinearLayout::vertical()
                .element(
                    elements::Paragraph::new(format!("{} for", i.role))
                        .styled(style::Style::new().with_font_size(10))
                )
                .element(
                    elements::Paragraph::new(i.client)
                        .styled(style::Style::new().bold().with_font_size(8))
                )
                .element(
                    items
                    .styled(style::Style::new().with_font_size(8))
                    .padded(Margins::trbl(2, 0, 5, 0)),
                )
        )
        .push()
        .expect("Invalid table row");
    }
    content_layout.push(table.padded(Margins::trbl(5, 0, 0, 0)));

    content_layout.push(elements::Paragraph::new(
        "Permanent Positions",
    ).styled(title_style));
    let mut permanent_pos_table = elements::TableLayout::new(vec![1, 2]);
    for i in contents.permanent_positions {
        let mut items = elements::UnorderedList::new();
        for pos in i.key_points {
            items.push(
                elements::Paragraph::new(pos).styled(detail_style)
            )
        }
        permanent_pos_table.row().element(
            elements::Paragraph::new(format!("{} - {}", i.start, i.end))
            .styled(style::Style::new().italic().with_font_size(10))
        ).element(
            elements::LinearLayout::vertical().element(
                    items
                    .styled(style::Style::new().with_font_size(8))
                    .padded(Margins::trbl(2, 0, 5, 0)),
                )
        )
        .push()
        .expect("Invalid table row");
    }
    content_layout.push(permanent_pos_table.padded(Margins::trbl(5, 0, 0, 0)));

    content_layout.push(elements::Paragraph::new(
        "Open-Source Engagement",
    ).styled(title_style));

    let mut oss_engagements_table = elements::TableLayout::new(vec![1, 2]);
    oss_engagements_table.row()
        .element(elements::Paragraph::new("GitHub"))
        .element(elements::Paragraph::new("https://github.com/nirnanaaa"))
        .push()
        .expect("Invalid table row");
    content_layout.push(oss_engagements_table.padded(Margins::trbl(5, 0, 0, 0)));

    doc.push(content_layout.padded(Margins::trbl(5.4, 19, 0, 19)));
    doc.render_to_file("CV.pdf")

}
