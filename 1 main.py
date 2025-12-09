

# https://sharecad.org/viewer#a92d7d90-05bb-46cb-99f6-dcf665ca633221590
# https://www.supernesting.com/
from ezdxf import transform

import numpy as np
import math
from ezdxf.fonts import fonts
import ezdxf
from ezdxf.addons.drawing import Frontend, RenderContext, svg, layout
from ezdxf.enums import TextEntityAlignment
from ezdxf.addons import text2path

import json
#
#
# with open('data.json') as f:
#     d = json.load(f)
#     # print(d)
#
#
#     print(d[0]["age"])
#
# exit()

# https://ezdxf.readthedocs.io/en/stable/tutorials/image_export.html
def not_tapered(base_width, end_width, length, gap, angle,offset_x, offset_y):
    points = []

    scale = 4
    # base_width = scale * 2
    # end_width = scale * 1
    # length = scale * 5
    # gap = scale * 3
    # angle = 30
    # angle = math.pi / 180 * (90 - angle)

    points.append((
        0,
        (base_width + length) * -1
    ))

    points.append((
        base_width / 2,
        (base_width + length) * -1
    ))

    points.append((
        base_width / 2,
        base_width * -1
    ))

    # points.append((
    #     width + gap/2,
    #     width * -1
    # ))

    points.append((
        base_width + gap / 2,
        0
    ))

    adjacent = math.cos(angle) * length
    opposite = math.sin(angle) * length

    non_angle_x = base_width + gap / 2 + adjacent
    non_angle_y = opposite

    distance = (base_width - end_width) / 2
    local_angle = (math.pi / 2) - angle
    local_angle = math.pi

    points.append((
        non_angle_x,
        non_angle_y

    ))

    adjacent = math.cos(angle) * base_width
    opposite = math.sin(angle) * base_width
    points.append((
        points[-1][0] - opposite,
        points[-1][1] + adjacent
    ))

    adjacent = math.cos(angle) * length
    opposite = math.sin(angle) * length
    points.append((
        points[-1][0] - adjacent,
        points[-1][1] - opposite
    ))

    second_half = points.copy()
    second_half.reverse()

    for i in range(len(second_half)):
        points.append((
            second_half[i][0] * -1,
            second_half[i][1]
        ))
    return points

def tapered(base_width, end_width, length, gap, angle,offset_x, offset_y, left, right, center, with_corner):
    points = []

    # scale = 4
    # base_width = scale * 6
    # end_width = scale * 5
    # length = scale * 10
    # gap = scale * 3
    # angle = 10
    # angle = math.pi / 180 * (90 - angle)

    points.append((
        0,
        (base_width + length) * -1
    ))

    points.append((
        end_width / 2,
        (base_width + length) * -1
    ))

    points.append((
        base_width / 2,
        base_width * -1
    ))
    if not with_corner:
        points.append((
            base_width + gap/2,
            base_width * -1
        ))
    else:
        points.append((
            ((base_width / 2) + (base_width + gap / 2))/2,
            ((base_width * -1) + 0) / 2
        ))


    points.append((
        base_width + gap / 2,
        0
    ))

    adjacent = math.cos(angle) * length
    opposite = math.sin(angle) * length

    x_1 = base_width + gap / 2 + adjacent
    y_1 = opposite

    distance = (base_width - end_width) / 2

    local_angle = math.pi - (math.pi / 2 - angle)

    points.append((
        distance * math.cos(local_angle) + x_1,
        distance * math.sin(local_angle) + y_1
    ))

    adjacent = math.cos(angle) * base_width
    opposite = math.sin(angle) * base_width
    x_2 = x_1 - opposite
    y_2 = y_1 + adjacent

    distance = end_width

    local_angle = math.pi - (math.pi / 2 - angle)

    points.append((
        distance * math.cos(local_angle) + points[-1][0],
        distance * math.sin(local_angle) + points[-1][1]

    ))

    adjacent = math.cos(angle) * length
    opposite = math.sin(angle) * length
    x_3 = x_2 - adjacent
    y_3 = y_2 - opposite
    points.append((
        x_3,
        y_3

    ))

    second_half = points.copy()
    second_half.reverse()

    for i in range(len(second_half)):
        points.append((
            second_half[i][0] * -1,
            second_half[i][1]
        ))

    for i in range(len(points)):
        points[i] = (
            points[i][0] + (offset_x * (base_width * 3 + length * 2)),
            points[i][1] + (offset_y * (base_width * 3 + length * 2))
        )
    return points


def gen_all_pieces():
    pass
    # doc = ezdxf.new( setup=True)
    doc = ezdxf.new()
    msp = doc.modelspace()

    font_size = 7

    scale = 4
    base_width = scale * 6
    end_width = scale * 5
    length = scale * 20
    gap = scale * 3
    # angle = 0
    # angle = math.pi / 180 * (90 - angle)

    with open('data.json') as f:
        data = json.load(f)
        data = [data[0]]

        for i in range(len(data)):




            points = tapered(
                base_width,
                end_width,
                length,
                gap,
                data[i]['angle'],
                i % 8,
                math.floor(i/8),
                data[i]['left'],
                data[i]['right'],
                data[i]['center'],
                with_corner=True

            )

            msp.add_lwpolyline(points)
            # msp.add_lwpolyline(not_tapered(base_width, end_width, length, gap, angle))
            # msp.add_lwpolyline(not_tapered(base_width, end_width, length, gap, angle))




            right_center_points_x = [
                points[4][0],
                points[5][0],
                points[6][0],
                points[7][0],
            ]
            right_center_points_y = [
                points[4][1],
                points[5][1],
                points[6][1],
                100,
                points[7][1],
            ]
            right_center_x = sum(right_center_points_x) / len(right_center_points_x)
            right_center_y = sum(right_center_points_y) / len(right_center_points_y)

            left_center_points_x = [
                points[8][0],
                points[9][0],
                points[10][0],
                points[11][0],
            ]
            left_center_points_y = [
                points[8][1],
                points[9][1],
                points[10][1],
                points[11][1],
            ]
            left_center_x = sum(left_center_points_x) / len(left_center_points_x)
            left_center_y = sum(left_center_points_y) / len(left_center_points_y)

            bottom_center_points_x = [
                points[11][0],
                points[12][0],
                points[1][0],
                points[2][0],
            ]
            bottom_center_points_y = [
                points[11][1],
                points[12][1],
                points[1][1],
                points[2][1],
            ]
            bottom_center_x = sum(bottom_center_points_x) / len(bottom_center_points_x)
            bottom_center_y = sum(bottom_center_points_y) / len(bottom_center_points_y)

            f = fonts.FontFace()
            # f = fonts.get_font_face("RomanS Regular")
            # f = fonts.find_font_face("times")
            # print(f)
            # f.weight = 100
            # print(f)


            paths = text2path.make_paths_from_str(str(data[i]["left"]), f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            for path in paths:
                points = []
                for v in path.flattening(0.2):
                    points.append((
                        v[0] + left_center_x,
                        v[1] + left_center_y
                    ))

                msp.add_lwpolyline(points)

            paths = text2path.make_paths_from_str(str(data[i]["right"]), f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            # paths = text2path.make_hatches_from_str(str(data[i]["right"]), f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)

            for path in paths:
                # msp.add_entity(path)
                # continue
                points = []
                for v in path.flattening(0.2):
                    points.append((
                        v[0] + right_center_x,
                        v[1] + right_center_y
                    ))

                msp.add_lwpolyline(points)

            paths = text2path.make_paths_from_str(str(data[i]["center"]), f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            for path in paths:
                points = []
                for v in path.flattening(0.2):
                    points.append((
                        v[0] + bottom_center_x,
                        v[1] + bottom_center_y
                    ))

                msp.add_lwpolyline(points)

    return doc

def gen_test_pieces():
    doc = ezdxf.new()


    msp = doc.modelspace()

    font_size = 7

    scale = 4
    base_width = scale * 6
    end_width = scale * 5
    length = scale * 20
    gap = scale * 3
    # angle = 0
    # angle = math.pi / 180 * (90 - angle)

    with open('data.json') as f:
        # data = json.load(f)
        # data_f = [

        # end of pip is about 1.4 to 1.5 wide
        # base width: 1.7 is veyr wide.
        # 0.7 size font seems like max


        # convert left right and center to strings.
        # so that i can do "0 1 0"

        data = [
            {
                "end_width": 1.3,
                "base_width": 1.65,
                "length": 3,
                "gap": 0.2,
                "angle": math.pi/2,
                "left": 234,
                "right": 567,
                "center":100,
                "font_size": 1.3 * 0.6, # end_width
                "with_corner": True
            },
            {
                "end_width": 1.4,
                "base_width": 1.7,
                "length": 3,
                "gap": 0.25,
                "angle": math.pi / 4,
                "left": 789,
                "right": 808,
                "center": 10,
                "font_size": 1.4 * 0.5,  # end_width
                "with_corner": True
            },
            {
                "end_width": 1.5,
                "base_width": 1.75,
                "length": 3,
                "gap": 0.3,
                "angle": math.pi / 6,
                "left": 100,
                "right": 50,
                "center": 1,
                "font_size": 1.5 * 0.4,  # end_width
                "with_corner": True
            },



            {
                "end_width": 1.3,
                "base_width": 1.8,
                "length": 2.5,
                "gap": 0.35,
                "angle": math.pi / 2,
                "left": 100,
                "right": 50,
                "center": 1,
                "font_size": 1.3 * 0.45,  # end_width
                "with_corner": False
            },
            {
                "end_width": 1.4,
                "base_width": 1.85,
                "length": 4,
                "gap": 0.4,
                "angle": math.pi / 4,
                "left": 100,
                "right": 50,
                "center": 1,
                "font_size": 1.4 * 0.35,  # end_width
                "with_corner": False
            },
            {
                "end_width": 1.5,
                "base_width": 2,
                "length": 5,
                "gap": 0.45,
                "angle": math.pi / 6,
                "left": 100,
                "right": 50,
                "center": 1,
                "font_size": 1.5 * 0.25,  # end_width
                "with_corner": False
            },

        ]

        # data.append(data[0])

        for i in range(len(data)):

            font_size = data[i]["font_size"]
            points = tapered(
                data[i]['base_width'],
                data[i]['end_width'],
                data[i]['length'],
                data[i]['gap'],
                data[i]['angle'],
                i % 8,
                math.floor(i / 8),
                data[i]['left'],
                data[i]['right'],
                data[i]['center'],
                data[i]['with_corner']

            )

            # font_size = 5
            #
            # points = tapered(
            #     base_width,
            #     end_width,
            #     length,
            #     gap,
            #     data[i]['angle'],
            #     i % 8,
            #     math.floor(i / 8),
            #     data[i]['left'],
            #     data[i]['right'],
            #     data[i]['center'],
            #     with_corner=False
            #
            # )

            msp.add_lwpolyline(points)
            # msp.add_lwpolyline(not_tapered(base_width, end_width, length, gap, angle))
            # msp.add_lwpolyline(not_tapered(base_width, end_width, length, gap, angle))

            right_center_points_x = [
                points[4][0],
                points[5][0],
                points[6][0],
                points[7][0],
            ]
            right_center_points_y = [
                points[4][1],
                points[5][1],
                points[6][1],
                points[7][1],
            ]
            right_center_x = sum(right_center_points_x) / len(right_center_points_x)
            right_center_y = sum(right_center_points_y) / len(right_center_points_y)

            left_center_points_x = [
                points[8][0],
                points[9][0],
                points[10][0],
                points[11][0],
            ]
            left_center_points_y = [
                points[8][1],
                points[9][1],
                points[10][1],
                points[11][1],
            ]
            left_center_x = sum(left_center_points_x) / len(left_center_points_x)
            left_center_y = sum(left_center_points_y) / len(left_center_points_y)

            bottom_center_points_x = [
                points[13][0],
                points[14][0],
                points[1][0],
                points[2][0],
            ]
            bottom_center_points_y = [
                points[13][1],
                points[14][1],
                points[1][1],
                points[2][1],
            ]
            bottom_center_x = sum(bottom_center_points_x) / len(bottom_center_points_x)
            bottom_center_y = sum(bottom_center_points_y) / len(bottom_center_points_y)

            f = fonts.FontFace()
            paths = text2path.make_paths_from_str("1 2 3", f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)






            counter = 0
            for path in paths:

                points = []
                theta = data[i]['angle'] * -1
                rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
                                               [np.sin(theta), np.cos(theta)]])
                for v in path.flattening(0.2):
                    rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T
                    points.append((
                        rotated_points[0] + left_center_x,
                        rotated_points[1] + left_center_y
                    ))

                msp.add_lwpolyline(points)

                counter += 1

            # paths = text2path.make_paths_from_str(str(data[i]["right"]), f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            paths = text2path.make_paths_from_str("4 5 6", f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)


            for path in paths:
                # msp.add_entity(path)
                # continue
                points = []
                for v in path.flattening(0.2):
                    theta = data[i]['angle']
                    rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
                                                   [np.sin(theta), np.cos(theta)]])
                    rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T

                    points.append((
                        rotated_points[0] + right_center_x,
                        rotated_points[1] + right_center_y
                    ))

                msp.add_lwpolyline(points)

            # paths = text2path.make_paths_from_str(str(data[i]["center"]), f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            paths = text2path.make_paths_from_str("7 8 9", f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            for path in paths:
                points = []
                for v in path.flattening(0.2):
                    theta = math.pi/2 + math.pi
                    rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
                                                   [np.sin(theta), np.cos(theta)]])
                    rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T

                    points.append((
                        rotated_points[0] + bottom_center_x,
                        rotated_points[1] + bottom_center_y
                    ))

                msp.add_lwpolyline(points)

        return doc


def export(doc):
    msp = doc.modelspace()
    # 1. create the render context
    context = RenderContext(doc)
    # 2. create the backend
    backend = svg.SVGBackend()
    # 3. create the frontend
    frontend = Frontend(context, backend)
    # 4. draw the modelspace
    frontend.draw_layout(msp)
    # 5. create an A4 page layout, not required for all backends
    # page = layout.Page(210, 297, layout.Units.mm, margins=layout.Margins.all(20))
    l = 100
    page = layout.Page(l,l, layout.Units.cm, margins=layout.Margins.all(l * 0.04))
    # 6. get the SVG rendering as string - this step is backend dependent
    svg_string = backend.get_string(page)
    with open("output.svg", "wt", encoding="utf8") as fp:
        fp.write(svg_string)

    doc.saveas("my_new_drawing.dxf")


# export(gen_all_pieces())
export(gen_test_pieces())