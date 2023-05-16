
use genpdf::{Element, Position, style, RenderResult, Size, Mm};
pub struct ColoredElement;

// impl ColoredElement {
//     fn draw(&mut self) {
//         let line_points: Vec<_> = points
//             .into_iter()
//             .map(|pos| (self.transform_position(pos).into(), false))
//             .collect();
//         let line = printpdf::Line {
//             points: line_points,
//             is_closed: false,
//             has_fill: false,
//             has_stroke: true,
//             is_clipping_path: false,
//         };
//         if let Some(color) = style.color() {
//             self.layer().set_outline_color(color.into());
//         }
//         self.layer().add_shape(line);
//         if style.color().is_some() {
//             self.layer().set_outline_color(Color::Rgb(0, 0, 0).into());
//         }
//     }
// }
impl Element for ColoredElement {
    fn render(
        &mut self,
        _: &genpdf::Context,
        area: genpdf::render::Area<'_>,
        style: style::Style,
    ) -> Result<genpdf::RenderResult, genpdf::error::Error> {
        area.draw_line(
            vec![
                Position {
                    x: 0.into(),
                    y: 0.into(),
                },
                Position {
                    x: 40.into(),
                    y: 20.into(),
                },
                Position {
                    x: area.size().width - Mm::from(40),
                    y: 20.into(),
                },
                Position {
                    x: area.size().width,
                    y: 0.into(),
                },
            ],
            style.with_color(style::Color::Rgb(19, 22, 38)),
        );
        for i in (0..80).map(|x| x as f64 * 0.3) {
            area.draw_line(
                vec![
                    Position {
                        x: 0.into(),
                        y: i.into(),
                    },
                    Position {
                        x: area.size().width,
                        y: i.into(),
                    },
                ],
                style.with_color(style::Color::Rgb(19, 22, 38)),
            );
        }

        Ok(RenderResult {
            size: Size {
                width: area.size().width,
                height: 1.into(),
            },
            has_more: false,
        })
    }
}