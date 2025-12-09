

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


def tapered(base_width,
            end_width,
            top_length,
            bottom_length,
            gap,
            right_angle,
            left_angle,
            offset_x,
            offset_y,

            ):

    # top_length = 3
    # bottom_length = 3.5
    # left_angle = math.pi/2
    # angle = math.pi/4

    # left_angle = math.pi/2
    # angle = 0

    with_corner = True


    points = []

    points.append((
        0,
        (base_width + bottom_length) * -1
    ))

    points.append((
        end_width / 2,
        (base_width + bottom_length) * -1
    ))

    points.append((
        base_width / 2,
        base_width * -1
    ))

    if with_corner:
        points.append((

            base_width + gap / 2,
            base_width * -1
        ))
    else:
        points.append((
            ((base_width / 2) + (base_width + gap / 2)) / 2,
            ((base_width * -1) + 0) / 2
        ))



    points.append((
        base_width + gap / 2,
        0
    ))

    adjacent = math.cos(right_angle) * top_length
    opposite = math.sin(right_angle) * top_length

    x_1 = base_width + gap / 2 + adjacent
    y_1 = opposite

    distance = (base_width - end_width) / 2

    local_angle = math.pi - (math.pi / 2 - right_angle)

    points.append((
        distance * math.cos(local_angle) + x_1,
        distance * math.sin(local_angle) + y_1
    ))

    adjacent = math.cos(right_angle) * base_width
    opposite = math.sin(right_angle) * base_width
    x_2 = x_1 - opposite
    y_2 = y_1 + adjacent

    distance = end_width

    local_angle = math.pi - (math.pi / 2 - right_angle)

    points.append((
        distance * math.cos(local_angle) + points[-1][0],
        distance * math.sin(local_angle) + points[-1][1]

    ))

    adjacent = math.cos(right_angle) * top_length
    opposite = math.sin(right_angle) * top_length
    x_3 = x_2 - adjacent
    y_3 = y_2 - opposite
    points.append((
        x_3,
        y_3

    ))

    points.append((
        0,
        points[-1][1]
    ))









    left_points = []

    left_points.append((
        0,
        (base_width + bottom_length) * -1
    ))

    left_points.append((
        end_width / 2,
        (base_width + bottom_length) * -1
    ))

    left_points.append((
        base_width / 2,
        base_width * -1
    ))

    if with_corner:
        left_points.append((
            base_width + gap / 2,
            base_width * -1
        ))
    else:
        left_points.append((
            ((base_width / 2) + (base_width + gap / 2)) / 2,
            ((base_width * -1) + 0) / 2
        ))

    left_points.append((
        base_width + gap / 2,
        0
    ))

    adjacent = math.cos(left_angle) * top_length
    opposite = math.sin(left_angle) * top_length

    x_1 = base_width + gap / 2 + adjacent
    y_1 = opposite

    distance = (base_width - end_width) / 2

    local_angle = math.pi - (math.pi / 2 - left_angle)

    left_points.append((
        distance * math.cos(local_angle) + x_1,
        distance * math.sin(local_angle) + y_1
    ))

    adjacent = math.cos(left_angle) * base_width
    opposite = math.sin(left_angle) * base_width
    x_2 = x_1 - opposite
    y_2 = y_1 + adjacent

    distance = end_width

    local_angle = math.pi - (math.pi / 2 - left_angle)

    left_points.append((
        distance * math.cos(local_angle) + left_points[-1][0],
        distance * math.sin(local_angle) + left_points[-1][1]

    ))

    adjacent = math.cos(left_angle) * top_length
    opposite = math.sin(left_angle) * top_length
    x_3 = x_2 - adjacent
    y_3 = y_2 - opposite
    left_points.append((
        x_3,
        y_3

    ))
    left_points.append((
        0,
        left_points[-1][1]
    ))
    # left_points.append((
    #     gap/2,
    #     left_points[-1][1]
    # ))



    # second_half = points.copy()
    # second_half.reverse()


    left_points.reverse()

    for i in range(len(left_points)):
        points.append((
            left_points[i][0] * -1,
            left_points[i][1]
        ))

    for i in range(len(points)):
        points[i] = (
            # points[i][0] + (offset_x * (base_width * 3 + length * 2)),
            # points[i][1] + (offset_y * (base_width * 3 + length * 2))
            points[i][0] + (offset_x * (3 * 3 + 3 * 2)),
            points[i][1] + (offset_y * (3 * 3 + 3 * 2))
        )
    return points



def make_single_stroke(number_str, str_paths):
    for i in range(len(number_str)):
        if number_str[i] == "0":
            del str_paths[i]  # keep inner
        if number_str[i] == "4":
            del str_paths[i]
        if number_str[i] == "6":
            del str_paths[i]
        if number_str[i] == "8":
            del str_paths[i]
            del str_paths[i + 1]
        if number_str[i] == "9":
            del str_paths[i]

    for i in range(len(str_paths)):
        if number_str[i] == "0":
            str_paths[i] = str_paths[i][0:16]
        if number_str[i] == "1":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][0: l // 2]
        if number_str[i] == "2":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][0: l // 2]
        if number_str[i] == "3":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][0: l // 2]
        if number_str[i] == "4":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][5: 11]
        if number_str[i] == "5":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][0: l // 2]
        if number_str[i] == "6":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][2: l // 2 + 6]
        if number_str[i] == "7":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][0: l // 2]
        if number_str[i] == "8":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][0: l - 2]
        if number_str[i] == "9":
            l = len(str_paths[i])
            str_paths[i] = str_paths[i][1: l - 11]

    return str_paths
def gen_pieces():
    doc = ezdxf.new()
    # doc = ezdxf.new("R2018")


    doc.styles.add("RomanS Regular", font="RomanS Regular.ttf")
    fonts.build_system_font_cache()
    # doc.styles.add("Bell", font="Bell MT.ttf")

    msp = doc.modelspace()

    font_size = 0.85
    gap = 0.8
    base_width = 1.8
    end_width = 1.5


    # scale = 4
    # base_width = scale * 6
    # end_width = scale * 5
    # length = scale * 20
    # gap = scale * 3
    # angle = 0
    # angle = math.pi / 180 * (90 - angle)

    with open('data.json') as f:
        data = json.load(f)
        # data['font_size'] = font_size
        # data_f = [

        # end of pip is about 1.4 to 1.5 wide
        # base width: 1.7 is veyr wide.
        # 0.7 size font seems like max


        # convert left right and center to strings.
        # so that i can do "0 1 0"

        # data = [
        #     {
        #         "end_width": 1.5,
        #         "base_width": 1.8,
        #         "top_length": 3,
        #         "bottom_length": 3,
        #         # "gap": 0.3,
        #         "gap": 0.8,
        #         "right_angle":math.pi/2,
        #         "left_angle": math.pi / 100,
        #         # "angle": math.pi / 3,
        #         "left_label": 23,
        #         "right_label": 567,
        #         "center_label":100,
        #         "font_size": 0.85,
        #
        #     },
        #
        #
        # ]

        # data.append(data[0])

        for i in range(len(data)):

            # font_size = data[i]["font_size"]
            # points = tapered(
            #     data[i]['base_width'],
            #     data[i]['end_width'],
            #     data[i]['top_length'],
            #     data[i]['bottom_length'],
            #     data[i]['gap'],
            #     data[i]['right_angle'],
            #     data[i]['left_angle'],
            #     i % 8,
            #     math.floor(i / 8),
            # )
            data[i]['right_angle'] = math.pi / 2 - data[i]['right_angle']
            data[i]['left_angle'] = math.pi / 2 - data[i]['left_angle']

            points = tapered(
                base_width,
                end_width,
                data[i]['top_length'] / 2,
                data[i]['bottom_length'] / 2,
                gap, # gap
                data[i]['right_angle'],
                data[i]['left_angle'],
                i % 8,
                math.floor(i / 8),
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
                points[7][1],
            ]
            right_center_x = sum(right_center_points_x) / len(right_center_points_x)
            right_center_y = sum(right_center_points_y) / len(right_center_points_y)

            left_center_points_x = [
                points[10][0],
                points[11][0],
                points[12][0],
                points[13][0],
            ]
            left_center_points_y = [
                points[10][1],
                points[11][1],
                points[12][1],
                points[13][1],
            ]
            left_center_x = sum(left_center_points_x) / len(left_center_points_x)
            left_center_y = sum(left_center_points_y) / len(left_center_points_y)

            bottom_center_points_x = [
                points[15][0],
                points[16][0],
                points[1][0],
                points[2][0],
            ]
            bottom_center_points_y = [
                points[15][1],
                points[16][1],
                points[1][1],
                points[2][1],
            ]
            bottom_center_x = sum(bottom_center_points_x) / len(bottom_center_points_x)
            bottom_center_y = sum(bottom_center_points_y) / len(bottom_center_points_y)

            # f = fonts.FontFace()
            # paths = text2path.make_paths_from_str("1 2 3", f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)

            # ezdxf.options.support_dirs.append(r"C:\jj_laptop_files\Python Projects\20251103     cad dxf\fonts")
            # fonts.build_system_font_cache()

            # doc.styles.
            # f = fonts.FontFace()
            # fonts.build_system_font_cache()
            # f = fonts.find_font_face("IAmOnlineWithU-o96q.ttf")

            f = fonts.find_font_face("RomanS Regular.ttf")

            number_str = str(data[i]['center_label'])
            paths = text2path.make_paths_from_str(number_str, f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)

            str_paths = []
            for path in paths:
                points = []
                for v in path.flattening(0.2):
                    theta = math.pi / 2 + math.pi
                    rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
                                                   [np.sin(theta), np.cos(theta)]])
                    rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T

                    points.append((
                        rotated_points[0] + bottom_center_x,
                        rotated_points[1] + bottom_center_y
                    ))

                str_paths.append(points)

            str_paths = make_single_stroke(number_str, str_paths)

            for path_i in range(len(str_paths)):
                msp.add_lwpolyline(str_paths[path_i])





            if int(data[i]['right_label']) > 64:
                continue




            # f = fonts.find_font_face("RomanS Regular.ttf")
            # print(f)
            number_str = str(data[i]['left_label'])

            # paths = text2path.make_paths_from_str(number_str, f, size=data[i]["font_size"], align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            paths = text2path.make_paths_from_str(number_str, f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
                       

            str_paths = []
            for path in paths:
                points = []
                theta = data[i]['left_angle'] * -1
                rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
                                               [np.sin(theta), np.cos(theta)]])
                for v in path.flattening(0.2):
                    rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T
                    points.append((
                        rotated_points[0] + left_center_x,
                        rotated_points[1] + left_center_y
                    ))

                str_paths.append(points)

            str_paths = make_single_stroke(number_str, str_paths)

            for path_i in range(len(str_paths)):
                msp.add_lwpolyline(str_paths[path_i])






            number_str = str(data[i]['right_label'])
            # paths = text2path.make_paths_from_str(number_str, f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            paths = text2path.make_paths_from_str(number_str, f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)

            str_paths = []
            for path in paths:
                # msp.add_entity(path)k
                # continue
                points = []
                for v in path.flattening(0.2):
                    theta = data[i]['right_angle']
                    # theta = 0
                    rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
                                                   [np.sin(theta), np.cos(theta)]])
                    rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T

                    points.append((
                        rotated_points[0] + right_center_x,
                        rotated_points[1] + right_center_y
                    ))

                str_paths.append(points)

            str_paths = make_single_stroke(number_str, str_paths)

            for path_i in range(len(str_paths)):
                msp.add_lwpolyline(str_paths[path_i])




            # number_str = str(data[i]['center_label'])
            # paths = text2path.make_paths_from_str(number_str, f, size=font_size, align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            #
            # str_paths = []
            # for path in paths:
            #     points = []
            #     for v in path.flattening(0.2):
            #         theta = math.pi/2 + math.pi
            #         rotation_matrix_2d = np.array([[np.cos(theta), -np.sin(theta)],
            #                                        [np.sin(theta), np.cos(theta)]])
            #         rotated_points = np.array([v[0], v[1]]) @ rotation_matrix_2d.T
            #
            #         points.append((
            #             rotated_points[0] + bottom_center_x,
            #             rotated_points[1] + bottom_center_y
            #         ))
            #
            #     str_paths.append(points)
            #
            # str_paths = make_single_stroke(number_str, str_paths)
            #
            # for path_i in range(len(str_paths)):
            #     msp.add_lwpolyline(str_paths[path_i])

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
    page = layout.Page(30,30, layout.Units.cm, margins=layout.Margins.all(l * 0.04))
    # 6. get the SVG rendering as string - this step is backend dependent
    svg_string = backend.get_string(page)
    with open("output.svg", "wt", encoding="utf8") as fp:
        fp.write(svg_string)

    doc.saveas("my_new_drawing.dxf")


# export(gen_all_pieces())
export(gen_pieces())