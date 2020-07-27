import React from 'react'

const Like = ({ className = '', style = {}, color }) => (
    <svg
        className={`${className}`}
        width="3686"
        height="100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
    >
        <circle cx="150" cy="50" r="36" fill={color} />
        <circle cx="250" cy="50" r="36" fill={color} />
        <circle cx="650" cy="50" r="36" fill="white" />
        <circle cx="550" cy="50" r="36" fill="white" />
        <circle cx="750" cy="50" r="37" fill="white" />
        <path
            d="M86 50C86 69.8822 69.8822 86 50 86C30.1177 86 14 69.8822 14 50C14 30.1177 30.1177 14 50 14C69.8822 14 86 30.1177 86 50Z"
            fill={color}
        />
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="14" y="14" width="72" height="72">
            <path
                d="M86 50C86 69.8822 69.8822 86 50 86C30.1177 86 14 69.8822 14 50C14 30.1177 30.1177 14 50 14C69.8822 14 86 30.1177 86 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask0)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M40.2981 37.6631C39.9028 42.4762 37.945 46.3327 36.5427 49.0948L36.5033 49.1726L32.9841 52.8816L42.3243 66.3386L45.4852 65.6917C46.7413 65.3612 48.2096 65.2606 49.8195 65.1504C53.0053 64.9322 56.7457 64.676 60.4942 62.524C60.5064 62.5172 60.5185 62.5102 60.5307 62.5032L69.3664 57.4019C71.1557 56.3689 71.7687 54.0809 70.7357 52.2917C70.2063 51.3748 69.3475 50.7668 68.3951 50.5308C69.3622 49.2611 69.5309 47.4843 68.6829 46.0156C68.0955 44.9982 67.1363 44.3294 66.0759 44.0818C67.1274 42.8057 67.3355 40.9612 66.4601 39.4449C65.8915 38.4601 64.9744 37.8019 63.9545 37.5362C65.0048 36.3643 65.2368 34.6057 64.4072 33.1688C63.3742 31.3795 61.0862 30.7665 59.2969 31.7995L50.4612 36.9008C49.8192 37.2715 49.3286 37.8037 49.0112 38.4165C48.7115 37.2018 47.7664 34.2743 46.1764 31.5204C44.1359 27.9861 40.4527 25.0075 38.4366 26.9569C37.4212 27.9386 38.0124 29.2877 38.7932 31.0696C39.5628 32.826 40.5166 35.0029 40.2981 37.6631Z"
                fill="white"
            />
            <path
                d="M7.30942 65.0551C5.93823 62.6802 6.75195 59.6433 9.12692 58.2721L28.2415 47.2363C30.6165 45.8651 33.6534 46.6788 35.0245 49.0538L45.4293 67.0755C46.8005 69.4504 45.9868 72.4873 43.6118 73.8585L24.4972 84.8943C22.1223 86.2655 19.0854 85.4518 17.7142 83.0768L7.30942 65.0551Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29.4829 49.3864L10.3683 60.4223C9.18082 61.1079 8.77396 62.6263 9.45955 63.8138L19.8644 81.8354C20.5499 83.0229 22.0684 83.4298 23.2559 82.7442L42.3705 71.7083C43.5579 71.0228 43.9648 69.5043 43.2792 68.3168L32.8744 50.2952C32.1888 49.1077 30.6704 48.7008 29.4829 49.3864ZM9.12692 58.2721C6.75195 59.6433 5.93823 62.6802 7.30942 65.0551L17.7142 83.0768C19.0854 85.4518 22.1223 86.2655 24.4972 84.8943L43.6118 73.8585C45.9868 72.4873 46.8005 69.4504 45.4293 67.0755L35.0245 49.0538C33.6534 46.6788 30.6165 45.8651 28.2415 47.2363L9.12692 58.2721Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.2421 50.7427C24.8358 50.3999 25.595 50.6033 25.9378 51.1971L29.2108 56.8661C29.5536 57.4598 29.3502 58.2191 28.7564 58.5618C28.1627 58.9046 27.4035 58.7012 27.0607 58.1075L23.7877 52.4385C23.4449 51.8447 23.6483 51.0855 24.2421 50.7427Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30.4242 61.4511C31.0179 61.1083 31.7771 61.3117 32.1199 61.9055L39.0296 73.8734C39.3724 74.4671 39.169 75.2263 38.5752 75.5691C37.9815 75.9119 37.2223 75.7085 36.8795 75.1147L29.9698 63.1468C29.627 62.5531 29.8304 61.7939 30.4242 61.4511Z"
                fill={color}
            />
        </g>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M50 83.5172C68.5111 83.5172 83.5172 68.5111 83.5172 50C83.5172 31.4889 68.5111 16.4828 50 16.4828C31.4889 16.4828 16.4828 31.4889 16.4828 50C16.4828 68.5111 31.4889 83.5172 50 83.5172ZM50 86C69.8822 86 86 69.8822 86 50C86 30.1177 69.8822 14 50 14C30.1177 14 14 30.1177 14 50C14 69.8822 30.1177 86 50 86Z"
            fill="white"
        />
        <circle cx="150" cy="50" r="4" fill="white" />
        <circle cx="250" cy="50" r="27" fill="white" />
        <circle cx="650" cy="50" r="27" fill={color} />
        <circle cx="550" cy="50" r="18" fill={color} />
        <circle cx="750" cy="50" r="33" fill={color} />
        <circle cx="350" cy="50" r="40" fill={color} />
        <circle cx="350" cy="50" r="38" fill="white" />
        <circle cx="450" cy="50" r="40" fill="white" />
        <circle cx="747" cy="8" r="3" fill="white" />
        <circle cx="754" cy="14" r="3" fill={color} />
        <circle cx="754" cy="92" r="3" transform="rotate(-180 754 92)" fill="white" />
        <circle cx="747" cy="86" r="3" transform="rotate(-180 747 86)" fill={color} />
        <circle cx="791.5" cy="46.5" r="3" transform="rotate(90 791.5 46.5)" fill="white" />
        <circle cx="785.5" cy="53.5" r="3" transform="rotate(90 785.5 53.5)" fill={color} />
        <circle cx="708.5" cy="53.5" r="3" transform="rotate(-90 708.5 53.5)" fill="white" />
        <circle cx="714.5" cy="46.5" r="3" transform="rotate(-90 714.5 46.5)" fill={color} />
        <circle cx="718.18" cy="22.4229" r="3" transform="rotate(-45 718.18 22.4229)" fill="white" />
        <circle cx="727.372" cy="21.7157" r="3" transform="rotate(-45 727.372 21.7157)" fill={color} />
        <circle cx="782.527" cy="76.8701" r="3" transform="rotate(135 782.527 76.8701)" fill="white" />
        <circle cx="773.335" cy="77.5773" r="3" transform="rotate(135 773.335 77.5773)" fill={color} />
        <circle cx="776.87" cy="18.1801" r="3" transform="rotate(45 776.87 18.1801)" fill="white" />
        <circle cx="777.577" cy="27.3725" r="3" transform="rotate(45 777.577 27.3725)" fill={color} />
        <circle cx="723.13" cy="81.8199" r="3" transform="rotate(-135 723.13 81.8199)" fill="white" />
        <circle cx="722.423" cy="72.6275" r="3" transform="rotate(-135 722.423 72.6275)" fill={color} />
        <path
            d="M643.588 49.668H645.592V47.448H647.224V49.668H649.228V51.168H647.224V53.388H645.592V51.168H643.588V49.668Z"
            fill="white"
        />
        <path
            d="M650.66 47.412C650.892 47.316 651.132 47.208 651.38 47.088C651.636 46.96 651.884 46.824 652.124 46.68C652.364 46.528 652.592 46.372 652.808 46.212C653.032 46.044 653.232 45.868 653.408 45.684H654.656V54H652.868V48.012C652.628 48.172 652.36 48.32 652.064 48.456C651.768 48.584 651.48 48.696 651.2 48.792L650.66 47.412Z"
            fill="white"
        />
        <path
            d="M740.84 49.5257H743.703V46.3542H746.034V49.5257H748.897V51.6685H746.034V54.8399H743.703V51.6685H740.84V49.5257Z"
            fill="white"
        />
        <path
            d="M750.943 46.3028C751.275 46.1657 751.617 46.0114 751.972 45.8399C752.337 45.6571 752.692 45.4628 753.035 45.2571C753.377 45.0399 753.703 44.8171 754.012 44.5885C754.332 44.3485 754.617 44.0971 754.869 43.8342H756.652V55.7142H754.097V47.1599C753.755 47.3885 753.372 47.5999 752.949 47.7942C752.526 47.9771 752.115 48.1371 751.715 48.2742L750.943 46.3028Z"
            fill="white"
        />
        <circle cx="850" cy="50" r="37" fill="white" />
        <circle cx="850" cy="50" r="35" fill={color} />
        <circle cx="847" cy="10" r="3" fill="white" />
        <circle cx="854" cy="12" r="3" fill={color} />
        <circle cx="854" cy="90" r="3" transform="rotate(-180 854 90)" fill="white" />
        <circle cx="847" cy="88" r="3" transform="rotate(-180 847 88)" fill={color} />
        <circle cx="889.5" cy="46.5" r="3" transform="rotate(90 889.5 46.5)" fill="white" />
        <circle cx="887.5" cy="53.5" r="3" transform="rotate(90 887.5 53.5)" fill={color} />
        <circle cx="810.5" cy="53.5" r="3" transform="rotate(-90 810.5 53.5)" fill="white" />
        <circle cx="812.5" cy="46.5" r="3" transform="rotate(-90 812.5 46.5)" fill={color} />
        <circle cx="819.594" cy="23.837" r="3" transform="rotate(-45 819.594 23.837)" fill="white" />
        <circle cx="825.958" cy="20.3015" r="3" transform="rotate(-45 825.958 20.3015)" fill={color} />
        <circle cx="881.113" cy="75.4558" r="3" transform="rotate(135 881.113 75.4558)" fill="white" />
        <circle cx="874.749" cy="78.9913" r="3" transform="rotate(135 874.749 78.9913)" fill={color} />
        <circle cx="875.456" cy="19.5944" r="3" transform="rotate(45 875.456 19.5944)" fill="white" />
        <circle cx="878.991" cy="25.9585" r="3" transform="rotate(45 878.991 25.9585)" fill={color} />
        <circle cx="824.544" cy="80.4056" r="3" transform="rotate(-135 824.544 80.4056)" fill="white" />
        <circle cx="821.009" cy="74.0415" r="3" transform="rotate(-135 821.009 74.0415)" fill={color} />
        <path
            d="M839.008 49.4308H842.443V45.6251H845.241V49.4308H848.676V52.0022H845.241V55.8079H842.443V52.0022H839.008V49.4308Z"
            fill="white"
        />
        <path
            d="M851.132 45.5634C851.529 45.3988 851.941 45.2136 852.366 45.0079C852.805 44.7885 853.23 44.5554 853.641 44.3085C854.053 44.0479 854.444 43.7805 854.814 43.5062C855.198 43.2182 855.541 42.9165 855.843 42.6011H857.982V56.8571H854.917V46.5919C854.505 46.8662 854.046 47.1199 853.539 47.3531C853.031 47.5725 852.537 47.7645 852.057 47.9291L851.132 45.5634Z"
            fill="white"
        />
        <circle cx="950" cy="50" r="37" fill="white" />
        <circle cx="1050" cy="50" r="37" fill={color} />
        <circle cx="1150" cy="50" r="37" fill={color} />
        <circle cx="1250" cy="50" r="37" fill={color} />
        <circle cx="1350" cy="50" r="37" fill={color} />
        <circle cx="1450" cy="50" r="37" fill={color} />
        <circle cx="1550" cy="50" r="37" fill={color} />
        <circle cx="1650" cy="50" r="37" fill={color} />
        <circle cx="1750" cy="50" r="37" fill={color} />
        <circle cx="1850" cy="50" r="37" fill={color} />
        <circle cx="1950" cy="50" r="37" fill={color} />
        <circle cx="2050" cy="50" r="37" fill={color} />
        <circle cx="2150" cy="50" r="37" fill={color} />
        <circle cx="2250" cy="50" r="37" fill={color} />
        <circle cx="2350" cy="50" r="37" fill={color} />
        <circle cx="2450" cy="50" r="37" fill={color} />
        <circle cx="2350" cy="50" r="4" fill="white" />
        <circle cx="2450" cy="50" r="27" fill="white" />
        <circle cx="950" cy="50" r="36" fill={color} />
        <circle cx="947" cy="12" r="3" fill="white" />
        <circle cx="954" cy="10" r="3" fill={color} />
        <circle cx="1047" cy="14" r="2" fill="white" />
        <circle cx="1054" cy="8" r="3" fill={color} />
        <circle cx="1146.5" cy="14.5" r="1.5" fill="white" />
        <circle cx="1154" cy="7" r="3" fill={color} />
        <circle cx="1246.5" cy="14.5" r="1.5" fill="white" />
        <circle cx="1254" cy="7" r="3" fill={color} />
        <circle cx="1346.5" cy="14.5" r="1.5" fill="white" fillOpacity="0.8" />
        <circle cx="1354" cy="7" r="3" fill={color} />
        <g opacity="0.8">
            <circle cx="1446" cy="15" r="1" fill="white" fillOpacity="0.8" />
            <circle cx="1454" cy="7" r="3" fill={color} />
        </g>
        <circle cx="954" cy="88" r="3" transform="rotate(-180 954 88)" fill="white" />
        <circle cx="947" cy="90" r="3" transform="rotate(-180 947 90)" fill={color} />
        <ellipse cx="1054" cy="86" rx="2" ry="2" transform="rotate(-180 1054 86)" fill="white" />
        <circle cx="1047" cy="92" r="3" transform="rotate(-180 1047 92)" fill={color} />
        <ellipse cx="1154.5" cy="85.5" rx="1.5" ry="1.5" transform="rotate(-180 1154.5 85.5)" fill="white" />
        <circle cx="1147" cy="93" r="3" transform="rotate(-180 1147 93)" fill={color} />
        <ellipse cx="1254.5" cy="85.5" rx="1.5" ry="1.5" transform="rotate(-180 1254.5 85.5)" fill="white" />
        <circle cx="1247" cy="93" r="3" transform="rotate(-180 1247 93)" fill={color} />
        <ellipse
            cx="1354.5"
            cy="85.5"
            rx="1.5"
            ry="1.5"
            transform="rotate(-180 1354.5 85.5)"
            fill="white"
            fillOpacity="0.8"
        />
        <circle cx="1347" cy="93" r="3" transform="rotate(-180 1347 93)" fill={color} />
        <g opacity="0.8">
            <ellipse cx="1455" cy="85" rx="1" ry="1" transform="rotate(-180 1455 85)" fill="white" fillOpacity="0.8" />
            <circle cx="1447" cy="93" r="3" transform="rotate(-180 1447 93)" fill={color} />
        </g>
        <circle cx="987.5" cy="46.5" r="3" transform="rotate(90 987.5 46.5)" fill="white" />
        <circle cx="989.5" cy="53.5" r="3" transform="rotate(90 989.5 53.5)" fill={color} />
        <circle cx="1085.5" cy="46.5" r="2.5" transform="rotate(90 1085.5 46.5)" fill="white" />
        <circle cx="1091.5" cy="53.5" r="3" transform="rotate(90 1091.5 53.5)" fill={color} />
        <ellipse cx="1185" cy="46" rx="2" ry="2" transform="rotate(90 1185 46)" fill="white" />
        <circle cx="1192.5" cy="53.5" r="3" transform="rotate(90 1192.5 53.5)" fill={color} />
        <ellipse cx="1285" cy="46" rx="2" ry="2" transform="rotate(90 1285 46)" fill="white" />
        <circle cx="1292.5" cy="53.5" r="3" transform="rotate(90 1292.5 53.5)" fill={color} />
        <ellipse cx="1385" cy="46" rx="2" ry="2" transform="rotate(90 1385 46)" fill="white" fillOpacity="0.8" />
        <circle cx="1392.5" cy="53.5" r="3" transform="rotate(90 1392.5 53.5)" fill={color} />
        <g opacity="0.8">
            <ellipse
                cx="1484.5"
                cy="45.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(90 1484.5 45.5)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1492.5" cy="53.5" r="3" transform="rotate(90 1492.5 53.5)" fill={color} />
        </g>
        <circle cx="912.5" cy="53.5" r="3" transform="rotate(-90 912.5 53.5)" fill="white" />
        <circle cx="910.5" cy="46.5" r="3" transform="rotate(-90 910.5 46.5)" fill={color} />
        <circle cx="921.009" cy="25.2512" r="3" transform="rotate(-45 921.009 25.2512)" fill="white" />
        <circle cx="924.544" cy="18.8873" r="3" transform="rotate(-45 924.544 18.8873)" fill={color} />
        <circle cx="979.698" cy="74.0416" r="3" transform="rotate(135 979.698 74.0416)" fill="white" />
        <circle cx="976.163" cy="80.4055" r="3" transform="rotate(135 976.163 80.4055)" fill={color} />
        <circle cx="974.042" cy="21.0086" r="3" transform="rotate(45 974.042 21.0086)" fill="white" />
        <circle cx="980.406" cy="24.5442" r="3" transform="rotate(45 980.406 24.5442)" fill={color} />
        <circle cx="925.958" cy="78.9914" r="3" transform="rotate(-135 925.958 78.9914)" fill="white" />
        <circle cx="919.594" cy="75.4558" r="3" transform="rotate(-135 919.594 75.4558)" fill={color} />
        <ellipse cx="1014.5" cy="53.5" rx="2.5" ry="2.5" transform="rotate(-90 1014.5 53.5)" fill="white" />
        <circle cx="1008.5" cy="46.5" r="3" transform="rotate(-90 1008.5 46.5)" fill={color} />
        <circle cx="1022.42" cy="26.6654" r="2" transform="rotate(-45 1022.42 26.6654)" fill="white" />
        <circle cx="1023.13" cy="17.473" r="3" transform="rotate(-45 1023.13 17.473)" fill={color} />
        <ellipse cx="1078.28" cy="72.6274" rx="2" ry="2" transform="rotate(135 1078.28 72.6274)" fill="white" />
        <circle cx="1077.58" cy="81.8198" r="3" transform="rotate(135 1077.58 81.8198)" fill={color} />
        <circle cx="1072.63" cy="22.4229" r="2.5" transform="rotate(45 1072.63 22.4229)" fill="white" />
        <circle cx="1081.82" cy="23.13" r="3" transform="rotate(45 1081.82 23.13)" fill={color} />
        <ellipse cx="1027.37" cy="77.5771" rx="2.5" ry="2.5" transform="rotate(-135 1027.37 77.5771)" fill="white" />
        <circle cx="1018.18" cy="76.87" r="3" transform="rotate(-135 1018.18 76.87)" fill={color} />
        <ellipse cx="1115" cy="54" rx="2" ry="2" transform="rotate(-90 1115 54)" fill="white" />
        <circle cx="1107.5" cy="46.5" r="3" transform="rotate(-90 1107.5 46.5)" fill={color} />
        <ellipse cx="1215" cy="54" rx="2" ry="2" transform="rotate(-90 1215 54)" fill="white" />
        <circle cx="1207.5" cy="46.5" r="3" transform="rotate(-90 1207.5 46.5)" fill={color} />
        <ellipse cx="1315" cy="54" rx="2" ry="2" transform="rotate(-90 1315 54)" fill="white" fillOpacity="0.8" />
        <circle cx="1307.5" cy="46.5" r="3" transform="rotate(-90 1307.5 46.5)" fill={color} />
        <g opacity="0.8">
            <ellipse
                cx="1415.5"
                cy="54.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(-90 1415.5 54.5)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1407.5" cy="46.5" r="3" transform="rotate(-90 1407.5 46.5)" fill={color} />
        </g>
        <g opacity="0.8">
            <circle cx="1546" cy="15" r="1" fill="white" fillOpacity="0.8" />
            <circle cx="1554" cy="7" r="2" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse cx="1555" cy="85" rx="1" ry="1" transform="rotate(-180 1555 85)" fill="white" fillOpacity="0.8" />
            <ellipse cx="1547" cy="93" rx="2" ry="2" transform="rotate(-180 1547 93)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1584.5"
                cy="45.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(90 1584.5 45.5)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1592.5" cy="53.5" r="2.5" transform="rotate(90 1592.5 53.5)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1515.5"
                cy="54.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(-90 1515.5 54.5)"
                fill="white"
                fillOpacity="0.8"
            />
            <ellipse cx="1507.5" cy="46.5" rx="2.5" ry="2.5" transform="rotate(-90 1507.5 46.5)" fill={color} />
        </g>
        <g opacity="0.8">
            <circle
                cx="1571.92"
                cy="22.4229"
                r="1"
                transform="rotate(45 1571.92 22.4229)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1583.23" cy="22.4228" r="2" transform="rotate(45 1583.23 22.4228)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1528.79"
                cy="78.2843"
                rx="1"
                ry="1"
                transform="rotate(-135 1528.79 78.2843)"
                fill="white"
                fillOpacity="0.8"
            />
            <ellipse cx="1517.47" cy="78.2844" rx="2" ry="2" transform="rotate(-135 1517.47 78.2844)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1577.58"
                cy="71.2131"
                rx="1.5"
                ry="1.5"
                transform="rotate(135 1577.58 71.2131)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1577.58" cy="82.5269" r="2.5" transform="rotate(135 1577.58 82.5269)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1522.42"
                cy="28.7869"
                rx="1.5"
                ry="1.5"
                transform="rotate(-45 1522.42 28.7869)"
                fill="white"
                fillOpacity="0.8"
            />
            <ellipse cx="1522.42" cy="17.4731" rx="2.5" ry="2.5" transform="rotate(-45 1522.42 17.4731)" fill={color} />
        </g>
        <g opacity="0.8">
            <circle cx="1646" cy="15" r="1" fill="white" fillOpacity="0.6" />
            <circle cx="1654" cy="7" r="2" fill={color} />
        </g>
        <g opacity="0.7">
            <circle cx="1746" cy="15" r="1" fill="white" fillOpacity="0.6" />
            <circle cx="1754.5" cy="7.5" r="1.5" fill={color} />
        </g>
        <g opacity="0.7">
            <circle cx="1846" cy="15" r="1" fill="white" fillOpacity="0.6" />
            <circle cx="1854.5" cy="7.5" r="1.5" fill={color} />
        </g>
        <g opacity="0.6">
            <circle cx="1946" cy="15" r="1" fill="white" fillOpacity="0.6" />
            <circle cx="1954.5" cy="7.5" r="1.5" fill={color} />
        </g>
        <g opacity="0.6">
            <circle cx="2046" cy="15" r="1" fill="white" fillOpacity="0.6" />
            <circle cx="2054" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.6">
            <circle cx="2146" cy="15" r="1" fill="white" fillOpacity="0.4" />
            <circle cx="2154" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.5">
            <circle cx="2246" cy="15" r="1" fill="white" fillOpacity="0.4" />
            <circle cx="2254" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.4">
            <circle cx="2346" cy="15" r="1" fill="white" fillOpacity="0.4" />
            <circle cx="2354" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.3">
            <circle cx="2446" cy="15" r="1" fill="white" fillOpacity="0.4" />
            <circle cx="2454" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse cx="1655" cy="85" rx="1" ry="1" transform="rotate(-180 1655 85)" fill="white" fillOpacity="0.6" />
            <ellipse cx="1647" cy="93" rx="2" ry="2" transform="rotate(-180 1647 93)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse cx="1755" cy="85" rx="1" ry="1" transform="rotate(-180 1755 85)" fill="white" fillOpacity="0.6" />
            <ellipse cx="1746.5" cy="93.5" rx="1.5" ry="1.5" transform="rotate(-180 1746.5 93.5)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse cx="1855" cy="85" rx="1" ry="1" transform="rotate(-180 1855 85)" fill="white" fillOpacity="0.6" />
            <ellipse cx="1846.5" cy="93.5" rx="1.5" ry="1.5" transform="rotate(-180 1846.5 93.5)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="1955" cy="85" rx="1" ry="1" transform="rotate(-180 1955 85)" fill="white" fillOpacity="0.6" />
            <ellipse cx="1946.5" cy="93.5" rx="1.5" ry="1.5" transform="rotate(-180 1946.5 93.5)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="2055" cy="85" rx="1" ry="1" transform="rotate(-180 2055 85)" fill="white" fillOpacity="0.6" />
            <ellipse cx="2047" cy="93" rx="1" ry="1" transform="rotate(-180 2047 93)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="2155" cy="85" rx="1" ry="1" transform="rotate(-180 2155 85)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2147" cy="93" rx="1" ry="1" transform="rotate(-180 2147 93)" fill={color} />
        </g>
        <g opacity="0.5">
            <ellipse cx="2255" cy="85" rx="1" ry="1" transform="rotate(-180 2255 85)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2247" cy="93" rx="1" ry="1" transform="rotate(-180 2247 93)" fill={color} />
        </g>
        <g opacity="0.4">
            <ellipse cx="2355" cy="85" rx="1" ry="1" transform="rotate(-180 2355 85)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2347" cy="93" rx="1" ry="1" transform="rotate(-180 2347 93)" fill={color} />
        </g>
        <g opacity="0.3">
            <ellipse cx="2455" cy="85" rx="1" ry="1" transform="rotate(-180 2455 85)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2447" cy="93" rx="1" ry="1" transform="rotate(-180 2447 93)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1684.5"
                cy="45.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(90 1684.5 45.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="1692.5" cy="53.5" r="2.5" transform="rotate(90 1692.5 53.5)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1784.5"
                cy="45.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(90 1784.5 45.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1792.5" cy="53.5" rx="1.5" ry="1.5" transform="rotate(90 1792.5 53.5)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1884.5"
                cy="45.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(90 1884.5 45.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1892.5" cy="53.5" rx="1.5" ry="1.5" transform="rotate(90 1892.5 53.5)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="1984.5"
                cy="45.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(90 1984.5 45.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1992.5" cy="53.5" rx="1.5" ry="1.5" transform="rotate(90 1992.5 53.5)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="2085" cy="46" rx="1" ry="1" transform="rotate(90 2085 46)" fill="white" fillOpacity="0.6" />
            <ellipse cx="2092" cy="53" rx="1" ry="1" transform="rotate(90 2092 53)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="2185" cy="46" rx="1" ry="1" transform="rotate(90 2185 46)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2192" cy="53" rx="1" ry="1" transform="rotate(90 2192 53)" fill={color} />
        </g>
        <g opacity="0.5">
            <ellipse cx="2285" cy="46" rx="1" ry="1" transform="rotate(90 2285 46)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2292" cy="53" rx="1" ry="1" transform="rotate(90 2292 53)" fill={color} />
        </g>
        <g opacity="0.4">
            <ellipse cx="2385" cy="46" rx="1" ry="1" transform="rotate(90 2385 46)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2392" cy="53" rx="1" ry="1" transform="rotate(90 2392 53)" fill={color} />
        </g>
        <g opacity="0.3">
            <ellipse cx="2485" cy="46" rx="1" ry="1" transform="rotate(90 2485 46)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2492" cy="53" rx="1" ry="1" transform="rotate(90 2492 53)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1615.5"
                cy="54.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(-90 1615.5 54.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1607.5" cy="46.5" rx="2.5" ry="2.5" transform="rotate(-90 1607.5 46.5)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1715.5"
                cy="54.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(-90 1715.5 54.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1707.5" cy="46.5" rx="1.5" ry="1.5" transform="rotate(-90 1707.5 46.5)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1815.5"
                cy="54.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(-90 1815.5 54.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1807.5" cy="46.5" rx="1.5" ry="1.5" transform="rotate(-90 1807.5 46.5)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="1915.5"
                cy="54.5"
                rx="1.5"
                ry="1.5"
                transform="rotate(-90 1915.5 54.5)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1907.5" cy="46.5" rx="1.5" ry="1.5" transform="rotate(-90 1907.5 46.5)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="2015" cy="54" rx="1" ry="1" transform="rotate(-90 2015 54)" fill="white" fillOpacity="0.6" />
            <ellipse cx="2008" cy="47" rx="1" ry="1" transform="rotate(-90 2008 47)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse cx="2115" cy="54" rx="1" ry="1" transform="rotate(-90 2115 54)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2108" cy="47" rx="1" ry="1" transform="rotate(-90 2108 47)" fill={color} />
        </g>
        <g opacity="0.5">
            <ellipse cx="2215" cy="54" rx="1" ry="1" transform="rotate(-90 2215 54)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2208" cy="47" rx="1" ry="1" transform="rotate(-90 2208 47)" fill={color} />
        </g>
        <g opacity="0.4">
            <ellipse cx="2315" cy="54" rx="1" ry="1" transform="rotate(-90 2315 54)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2308" cy="47" rx="1" ry="1" transform="rotate(-90 2308 47)" fill={color} />
        </g>
        <g opacity="0.3">
            <ellipse cx="2415" cy="54" rx="1" ry="1" transform="rotate(-90 2415 54)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2408" cy="47" rx="1" ry="1" transform="rotate(-90 2408 47)" fill={color} />
        </g>
        <g opacity="0.6">
            <circle
                cx="2022.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2022.07 28.2261)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="2022.78" cy="17.6195" r="1" transform="rotate(-45 2022.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.6">
            <circle
                cx="2122.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2122.07 28.2261)"
                fill="white"
                fillOpacity="0.4"
            />
            <circle cx="2122.78" cy="17.6195" r="1" transform="rotate(-45 2122.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.5">
            <circle
                cx="2222.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2222.07 28.2261)"
                fill="white"
                fillOpacity="0.4"
            />
            <circle cx="2222.78" cy="17.6195" r="1" transform="rotate(-45 2222.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.4">
            <circle
                cx="2322.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2322.07 28.2261)"
                fill="white"
                fillOpacity="0.4"
            />
            <circle cx="2322.78" cy="17.6195" r="1" transform="rotate(-45 2322.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.3">
            <circle
                cx="2422.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2422.07 28.2261)"
                fill="white"
                fillOpacity="0.4"
            />
            <circle cx="2422.78" cy="17.6195" r="1" transform="rotate(-45 2422.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="2077.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2077.93 71.3596)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="2077.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2077.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="2177.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2177.93 71.3596)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2177.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2177.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.5">
            <ellipse
                cx="2277.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2277.93 71.3596)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2277.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2277.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.4">
            <ellipse
                cx="2377.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2377.93 71.3596)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2377.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2377.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.3">
            <ellipse
                cx="2477.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2477.93 71.3596)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2477.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2477.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="2071.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2071.57 22.5692)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="2081.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2081.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="2171.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2171.57 22.5692)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2181.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2181.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.5">
            <ellipse
                cx="2271.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2271.57 22.5692)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2281.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2281.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.4">
            <ellipse
                cx="2371.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2371.57 22.5692)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2381.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2381.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.3">
            <ellipse
                cx="2471.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2471.57 22.5692)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2481.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2481.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="2027.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2027.73 77.7236)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="2017.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2017.83 77.7236)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="2127.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2127.73 77.7236)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2117.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2117.83 77.7236)" fill={color} />
        </g>
        <g opacity="0.5">
            <ellipse
                cx="2227.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2227.73 77.7236)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2217.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2217.83 77.7236)" fill={color} />
        </g>
        <g opacity="0.4">
            <ellipse
                cx="2327.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2327.73 77.7236)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2317.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2317.83 77.7236)" fill={color} />
        </g>
        <g opacity="0.3">
            <ellipse
                cx="2427.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2427.73 77.7236)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2417.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2417.83 77.7236)" fill={color} />
        </g>
        <g opacity="0.7">
            <circle
                cx="1722.07"
                cy="28.2262"
                r="1"
                transform="rotate(-45 1722.07 28.2262)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="1722.78" cy="16.9125" r="1.5" transform="rotate(-45 1722.78 16.9125)" fill={color} />
        </g>
        <g opacity="0.7">
            <circle
                cx="1822.07"
                cy="28.2262"
                r="1"
                transform="rotate(-45 1822.07 28.2262)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="1822.78" cy="16.9125" r="1.5" transform="rotate(-45 1822.78 16.9125)" fill={color} />
        </g>
        <g opacity="0.6">
            <circle
                cx="1922.07"
                cy="28.2262"
                r="1"
                transform="rotate(-45 1922.07 28.2262)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="1922.78" cy="16.9125" r="1.5" transform="rotate(-45 1922.78 16.9125)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1777.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 1777.93 71.3596)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1777.93" cy="83.3805" rx="1.5" ry="1.5" transform="rotate(135 1777.93 83.3805)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1877.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 1877.93 71.3596)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1877.93" cy="83.3805" rx="1.5" ry="1.5" transform="rotate(135 1877.93 83.3805)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="1977.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 1977.93 71.3596)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1977.93" cy="83.3805" rx="1.5" ry="1.5" transform="rotate(135 1977.93 83.3805)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1770.86"
                cy="22.5693"
                rx="1.5"
                ry="1.5"
                transform="rotate(45 1770.86 22.5693)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1782.17" cy="22.5693" rx="1.5" ry="1.5" transform="rotate(45 1782.17 22.5693)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1870.86"
                cy="22.5693"
                rx="1.5"
                ry="1.5"
                transform="rotate(45 1870.86 22.5693)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1882.17" cy="22.5693" rx="1.5" ry="1.5" transform="rotate(45 1882.17 22.5693)" fill={color} />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="1970.86"
                cy="22.5693"
                rx="1.5"
                ry="1.5"
                transform="rotate(45 1970.86 22.5693)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1982.17" cy="22.5693" rx="1.5" ry="1.5" transform="rotate(45 1982.17 22.5693)" fill={color} />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1728.43"
                cy="77.7236"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1728.43 77.7236)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse
                cx="1717.12"
                cy="77.7236"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1717.12 77.7236)"
                fill={color}
            />
        </g>
        <g opacity="0.7">
            <ellipse
                cx="1828.43"
                cy="77.7236"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1828.43 77.7236)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse
                cx="1817.12"
                cy="77.7236"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1817.12 77.7236)"
                fill={color}
            />
        </g>
        <g opacity="0.6">
            <ellipse
                cx="1928.43"
                cy="77.7236"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1928.43 77.7236)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse
                cx="1917.12"
                cy="77.7236"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1917.12 77.7236)"
                fill={color}
            />
        </g>
        <g opacity="0.8">
            <circle
                cx="1671.92"
                cy="22.4229"
                r="1"
                transform="rotate(45 1671.92 22.4229)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="1683.23" cy="22.4228" r="2" transform="rotate(45 1683.23 22.4228)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1628.79"
                cy="78.2843"
                rx="1"
                ry="1"
                transform="rotate(-135 1628.79 78.2843)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1617.47" cy="78.2844" rx="2" ry="2" transform="rotate(-135 1617.47 78.2844)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1677.58"
                cy="71.2131"
                rx="1.5"
                ry="1.5"
                transform="rotate(135 1677.58 71.2131)"
                fill="white"
                fillOpacity="0.6"
            />
            <circle cx="1677.58" cy="82.5269" r="2.5" transform="rotate(135 1677.58 82.5269)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1622.42"
                cy="28.7869"
                rx="1.5"
                ry="1.5"
                transform="rotate(-45 1622.42 28.7869)"
                fill="white"
                fillOpacity="0.6"
            />
            <ellipse cx="1622.42" cy="17.4731" rx="2.5" ry="2.5" transform="rotate(-45 1622.42 17.4731)" fill={color} />
        </g>
        <g opacity="0.8">
            <circle
                cx="1422.42"
                cy="28.0797"
                r="1"
                transform="rotate(-45 1422.42 28.0797)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1422.42" cy="16.766" r="3" transform="rotate(-45 1422.42 16.766)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1478.28"
                cy="71.2133"
                rx="1"
                ry="1"
                transform="rotate(135 1478.28 71.2133)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1478.28" cy="82.527" r="3" transform="rotate(135 1478.28 82.527)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1471.21"
                cy="22.4228"
                rx="1.5"
                ry="1.5"
                transform="rotate(45 1471.21 22.4228)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1482.53" cy="22.4228" r="3" transform="rotate(45 1482.53 22.4228)" fill={color} />
        </g>
        <g opacity="0.8">
            <ellipse
                cx="1428.79"
                cy="77.5772"
                rx="1.5"
                ry="1.5"
                transform="rotate(-135 1428.79 77.5772)"
                fill="white"
                fillOpacity="0.8"
            />
            <circle cx="1417.47" cy="77.5772" r="3" transform="rotate(-135 1417.47 77.5772)" fill={color} />
        </g>
        <circle cx="1122.42" cy="27.3727" r="1.5" transform="rotate(-45 1122.42 27.3727)" fill="white" />
        <circle cx="1122.42" cy="16.766" r="3" transform="rotate(-45 1122.42 16.766)" fill={color} />
        <circle cx="1222.42" cy="27.3727" r="1.5" transform="rotate(-45 1222.42 27.3727)" fill="white" />
        <circle cx="1222.42" cy="16.766" r="3" transform="rotate(-45 1222.42 16.766)" fill={color} />
        <circle
            cx="1322.42"
            cy="27.3727"
            r="1.5"
            transform="rotate(-45 1322.42 27.3727)"
            fill="white"
            fillOpacity="0.8"
        />
        <circle cx="1322.42" cy="16.766" r="3" transform="rotate(-45 1322.42 16.766)" fill={color} />
        <ellipse cx="1178.28" cy="71.9203" rx="1.5" ry="1.5" transform="rotate(135 1178.28 71.9203)" fill="white" />
        <circle cx="1178.28" cy="82.527" r="3" transform="rotate(135 1178.28 82.527)" fill={color} />
        <ellipse cx="1278.28" cy="71.9203" rx="1.5" ry="1.5" transform="rotate(135 1278.28 71.9203)" fill="white" />
        <circle cx="1278.28" cy="82.527" r="3" transform="rotate(135 1278.28 82.527)" fill={color} />
        <ellipse
            cx="1378.28"
            cy="71.9203"
            rx="1.5"
            ry="1.5"
            transform="rotate(135 1378.28 71.9203)"
            fill="white"
            fillOpacity="0.8"
        />
        <circle cx="1378.28" cy="82.527" r="3" transform="rotate(135 1378.28 82.527)" fill={color} />
        <ellipse cx="1171.92" cy="22.4228" rx="2" ry="2" transform="rotate(45 1171.92 22.4228)" fill="white" />
        <circle cx="1182.53" cy="22.4228" r="3" transform="rotate(45 1182.53 22.4228)" fill={color} />
        <ellipse cx="1271.92" cy="22.4228" rx="2" ry="2" transform="rotate(45 1271.92 22.4228)" fill="white" />
        <circle cx="1282.53" cy="22.4228" r="3" transform="rotate(45 1282.53 22.4228)" fill={color} />
        <ellipse
            cx="1371.92"
            cy="22.4228"
            rx="2"
            ry="2"
            transform="rotate(45 1371.92 22.4228)"
            fill="white"
            fillOpacity="0.8"
        />
        <circle cx="1382.53" cy="22.4228" r="3" transform="rotate(45 1382.53 22.4228)" fill={color} />
        <ellipse cx="1128.08" cy="77.5772" rx="2" ry="2" transform="rotate(-135 1128.08 77.5772)" fill="white" />
        <circle cx="1117.47" cy="77.5772" r="3" transform="rotate(-135 1117.47 77.5772)" fill={color} />
        <ellipse cx="1228.08" cy="77.5772" rx="2" ry="2" transform="rotate(-135 1228.08 77.5772)" fill="white" />
        <circle cx="1217.47" cy="77.5772" r="3" transform="rotate(-135 1217.47 77.5772)" fill={color} />
        <ellipse
            cx="1328.08"
            cy="77.5772"
            rx="2"
            ry="2"
            transform="rotate(-135 1328.08 77.5772)"
            fill="white"
            fillOpacity="0.8"
        />
        <circle cx="1317.47" cy="77.5772" r="3" transform="rotate(-135 1317.47 77.5772)" fill={color} />
        <path
            d="M934.428 49.1936H939.295V43.8022H943.258V49.1936H948.125V52.8365H943.258V58.2279H939.295V52.8365H934.428V49.1936Z"
            fill="white"
        />
        <path
            d="M951.603 43.7148C952.167 43.4816 952.75 43.2193 953.352 42.9279C953.974 42.617 954.576 42.2868 955.159 41.937C955.742 41.5679 956.295 41.189 956.82 40.8005C957.364 40.3925 957.85 39.965 958.277 39.5182H961.308V59.7142H956.966V45.1719C956.383 45.5605 955.732 45.9199 955.013 46.2502C954.294 46.561 953.595 46.833 952.915 47.0662L951.603 43.7148Z"
            fill="white"
        />
        <path
            d="M1032.6 49.0987H1038.04V43.073H1042.46V49.0987H1047.9V53.1702H1042.46V59.1959H1038.04V53.1702H1032.6V49.0987Z"
            fill="white"
        />
        <path
            d="M1051.79 42.9753C1052.42 42.7147 1053.07 42.4216 1053.75 42.0959C1054.44 41.7485 1055.11 41.3793 1055.77 40.9885C1056.42 40.5759 1057.04 40.1525 1057.62 39.7182C1058.23 39.2622 1058.77 38.7845 1059.25 38.285H1062.64V60.857H1057.79V44.6039C1057.13 45.0382 1056.41 45.4399 1055.6 45.809C1054.8 46.1565 1054.02 46.4605 1053.26 46.721L1051.79 42.9753Z"
            fill="white"
        />
        <path
            d="M1132.6 49.0987H1138.04V43.073H1142.46V49.0987H1147.9V53.1702H1142.46V59.1959H1138.04V53.1702H1132.6V49.0987Z"
            fill="white"
        />
        <path
            d="M1151.79 42.9753C1152.42 42.7147 1153.07 42.4216 1153.75 42.0959C1154.44 41.7485 1155.11 41.3793 1155.77 40.9885C1156.42 40.5759 1157.04 40.1525 1157.62 39.7182C1158.23 39.2622 1158.77 38.7845 1159.25 38.285H1162.64V60.857H1157.79V44.6039C1157.13 45.0382 1156.41 45.4399 1155.6 45.809C1154.8 46.1565 1154.02 46.4605 1153.26 46.721L1151.79 42.9753Z"
            fill="white"
        />
        <path
            d="M1232.6 49.0987H1238.04V43.073H1242.46V49.0987H1247.9V53.1702H1242.46V59.1959H1238.04V53.1702H1232.6V49.0987Z"
            fill="white"
        />
        <path
            d="M1251.79 42.9753C1252.42 42.7147 1253.07 42.4216 1253.75 42.0959C1254.44 41.7485 1255.11 41.3793 1255.77 40.9885C1256.42 40.5759 1257.04 40.1525 1257.62 39.7182C1258.23 39.2622 1258.77 38.7845 1259.25 38.285H1262.64V60.857H1257.79V44.6039C1257.13 45.0382 1256.41 45.4399 1255.6 45.809C1254.8 46.1565 1254.02 46.4605 1253.26 46.721L1251.79 42.9753Z"
            fill="white"
        />
        <path
            d="M1332.6 49.0987H1338.04V43.073H1342.46V49.0987H1347.9V53.1702H1342.46V59.1959H1338.04V53.1702H1332.6V49.0987Z"
            fill="white"
        />
        <path
            d="M1351.79 42.9753C1352.42 42.7147 1353.07 42.4216 1353.75 42.0959C1354.44 41.7485 1355.11 41.3793 1355.77 40.9885C1356.42 40.5759 1357.04 40.1525 1357.62 39.7182C1358.23 39.2622 1358.77 38.7845 1359.25 38.285H1362.64V60.857H1357.79V44.6039C1357.13 45.0382 1356.41 45.4399 1355.6 45.809C1354.8 46.1565 1354.02 46.4605 1353.26 46.721L1351.79 42.9753Z"
            fill="white"
        />
        <path
            d="M1433.51 49.1462H1438.66V43.4376H1442.86V49.1462H1448.01V53.0033H1442.86V58.7119H1438.66V53.0033H1433.51V49.1462Z"
            fill="white"
        />
        <path
            d="M1451.7 43.345C1452.29 43.0982 1452.91 42.8205 1453.55 42.5119C1454.21 42.1828 1454.85 41.833 1455.46 41.4628C1456.08 41.0719 1456.67 40.6708 1457.22 40.2593C1457.8 39.8273 1458.31 39.3748 1458.76 38.9016H1461.97V60.2856H1457.38V44.8879C1456.76 45.2993 1456.07 45.6799 1455.31 46.0296C1454.55 46.3588 1453.81 46.6468 1453.09 46.8936L1451.7 43.345Z"
            fill="white"
        />
        <path
            d="M1534.43 49.1936H1539.29V43.8022H1543.26V49.1936H1548.12V52.8365H1543.26V58.2279H1539.29V52.8365H1534.43V49.1936Z"
            fill="white"
        />
        <path
            d="M1551.6 43.7148C1552.17 43.4816 1552.75 43.2193 1553.35 42.9279C1553.97 42.617 1554.58 42.2868 1555.16 41.937C1555.74 41.5679 1556.3 41.189 1556.82 40.8005C1557.36 40.3925 1557.85 39.965 1558.28 39.5182H1561.31V59.7142H1556.97V45.1719C1556.38 45.5605 1555.73 45.9199 1555.01 46.2502C1554.29 46.561 1553.59 46.833 1552.91 47.0662L1551.6 43.7148Z"
            fill="white"
        />
        <path
            d="M1636.26 49.2885H1640.55V44.5313H1644.05V49.2885H1648.35V52.5028H1644.05V57.2599H1640.55V52.5028H1636.26V49.2885Z"
            fill="white"
        />
        <path
            d="M1651.41 44.4542C1651.91 44.2485 1652.43 44.0171 1652.96 43.7599C1653.51 43.4856 1654.04 43.1942 1654.55 42.8856C1655.07 42.5599 1655.55 42.2256 1656.02 41.8828C1656.5 41.5228 1656.93 41.1456 1657.3 40.7513H1659.98V58.5713H1656.15V45.7399C1655.63 46.0828 1655.06 46.3999 1654.42 46.6913C1653.79 46.9656 1653.17 47.2056 1652.57 47.4113L1651.41 44.4542Z"
            fill="white"
        />
        <g opacity="0.9">
            <path
                d="M1737.18 49.3359H1741.18V44.8959H1744.45V49.3359H1748.46V52.3359H1744.45V56.7759H1741.18V52.3359H1737.18V49.3359Z"
                fill="white"
            />
            <path
                d="M1751.32 44.8239C1751.78 44.6319 1752.26 44.4159 1752.76 44.1759C1753.27 43.9199 1753.77 43.6479 1754.25 43.3599C1754.73 43.0559 1755.18 42.7439 1755.62 42.4239C1756.06 42.0879 1756.46 41.7359 1756.82 41.3679H1759.31V57.9999H1755.74V46.0239C1755.26 46.3439 1754.72 46.6399 1754.13 46.9119C1753.54 47.1679 1752.96 47.3919 1752.4 47.5839L1751.32 44.8239Z"
                fill="white"
            />
        </g>
        <g opacity="0.8">
            <path
                d="M1838.09 49.3834H1841.81V45.2605H1844.84V49.3834H1848.57V52.1691H1844.84V56.2919H1841.81V52.1691H1838.09V49.3834Z"
                fill="white"
            />
            <path
                d="M1851.23 45.1936C1851.66 45.0154 1852.1 44.8148 1852.56 44.5919C1853.04 44.3542 1853.5 44.1016 1853.94 43.8342C1854.39 43.5519 1854.81 43.2622 1855.22 42.9651C1855.63 42.6531 1856 42.3262 1856.33 41.9845H1858.65V57.4285H1855.33V46.3079C1854.88 46.6051 1854.38 46.8799 1853.83 47.1325C1853.28 47.3702 1852.75 47.5782 1852.23 47.7565L1851.23 45.1936Z"
                fill="white"
            />
        </g>
        <g opacity="0.7">
            <path
                d="M1939.01 49.4308H1942.44V45.6251H1945.24V49.4308H1948.68V52.0022H1945.24V55.8079H1942.44V52.0022H1939.01V49.4308Z"
                fill="white"
            />
            <path
                d="M1951.13 45.5634C1951.53 45.3988 1951.94 45.2136 1952.37 45.0079C1952.8 44.7885 1953.23 44.5554 1953.64 44.3085C1954.05 44.0479 1954.44 43.7805 1954.81 43.5062C1955.2 43.2182 1955.54 42.9165 1955.84 42.6011H1957.98V56.8571H1954.92V46.5919C1954.51 46.8662 1954.05 47.1199 1953.54 47.3531C1953.03 47.5725 1952.54 47.7645 1952.06 47.9291L1951.13 45.5634Z"
                fill="white"
            />
        </g>
        <g opacity="0.5">
            <path
                d="M2039.92 49.4782H2043.07V45.9897H2045.64V49.4782H2048.79V51.8354H2045.64V55.3239H2043.07V51.8354H2039.92V49.4782Z"
                fill="white"
            />
            <path
                d="M2051.04 45.9331C2051.4 45.7822 2051.78 45.6125 2052.17 45.4239C2052.57 45.2228 2052.96 45.0091 2053.34 44.7828C2053.72 44.5439 2054.07 44.2988 2054.41 44.0474C2054.76 43.7834 2055.08 43.5068 2055.36 43.2177H2057.32V56.2857H2054.51V46.8759C2054.13 47.1274 2053.71 47.3599 2053.24 47.5737C2052.78 47.7748 2052.33 47.9508 2051.89 48.1017L2051.04 45.9331Z"
                fill="white"
            />
        </g>
        <g opacity="0.3">
            <path
                d="M2140.84 49.5257H2143.7V46.3542H2146.03V49.5257H2148.9V51.6685H2146.03V54.8399H2143.7V51.6685H2140.84V49.5257Z"
                fill="white"
            />
            <path
                d="M2150.94 46.3028C2151.27 46.1657 2151.62 46.0114 2151.97 45.8399C2152.34 45.6571 2152.69 45.4628 2153.03 45.2571C2153.38 45.0399 2153.7 44.8171 2154.01 44.5885C2154.33 44.3485 2154.62 44.0971 2154.87 43.8342H2156.65V55.7142H2154.1V47.1599C2153.75 47.3885 2153.37 47.5999 2152.95 47.7942C2152.53 47.9771 2152.11 48.1371 2151.71 48.2742L2150.94 46.3028Z"
                fill="white"
            />
        </g>
        <g opacity="0.1">
            <path
                d="M2240.84 49.5257H2243.7V46.3542H2246.03V49.5257H2248.9V51.6685H2246.03V54.8399H2243.7V51.6685H2240.84V49.5257Z"
                fill="white"
            />
            <path
                d="M2250.94 46.3028C2251.27 46.1657 2251.62 46.0114 2251.97 45.8399C2252.34 45.6571 2252.69 45.4628 2253.03 45.2571C2253.38 45.0399 2253.7 44.8171 2254.01 44.5885C2254.33 44.3485 2254.62 44.0971 2254.87 43.8342H2256.65V55.7142H2254.1V47.1599C2253.75 47.3885 2253.37 47.5999 2252.95 47.7942C2252.53 47.9771 2252.11 48.1371 2251.71 48.2742L2250.94 46.3028Z"
                fill="white"
            />
        </g>
        <path
            d="M3586 50C3586 69.8822 3569.88 86 3550 86C3530.12 86 3514 69.8822 3514 50C3514 30.1177 3530.12 14 3550 14C3569.88 14 3586 30.1177 3586 50Z"
            fill={color}
        />
        <path
            d="M3686 50C3686 69.8822 3669.88 86 3650 86C3630.12 86 3614 69.8822 3614 50C3614 30.1177 3630.12 14 3650 14C3669.88 14 3686 30.1177 3686 50Z"
            fill={color}
        />
        <path
            d="M3386 50C3386 69.8822 3369.88 86 3350 86C3330.12 86 3314 69.8822 3314 50C3314 30.1177 3330.12 14 3350 14C3369.88 14 3386 30.1177 3386 50Z"
            fill={color}
        />
        <path
            d="M3286 50C3286 69.8822 3269.88 86 3250 86C3230.12 86 3214 69.8822 3214 50C3214 30.1177 3230.12 14 3250 14C3269.88 14 3286 30.1177 3286 50Z"
            fill={color}
        />
        <path
            d="M3186 50C3186 69.8822 3169.88 86 3150 86C3130.12 86 3114 69.8822 3114 50C3114 30.1177 3130.12 14 3150 14C3169.88 14 3186 30.1177 3186 50Z"
            fill={color}
        />
        <path
            d="M3086 50C3086 69.8822 3069.88 86 3050 86C3030.12 86 3014 69.8822 3014 50C3014 30.1177 3030.12 14 3050 14C3069.88 14 3086 30.1177 3086 50Z"
            fill={color}
        />
        <path
            d="M2986 50C2986 69.8822 2969.88 86 2950 86C2930.12 86 2914 69.8822 2914 50C2914 30.1177 2930.12 14 2950 14C2969.88 14 2986 30.1177 2986 50Z"
            fill={color}
        />
        <path
            d="M3486 50C3486 69.8822 3469.88 86 3450 86C3430.12 86 3414 69.8822 3414 50C3414 30.1177 3430.12 14 3450 14C3469.88 14 3486 30.1177 3486 50Z"
            fill={color}
        />
        <mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="3514" y="14" width="72" height="72">
            <path
                d="M3586 50C3586 69.8822 3569.88 86 3550 86C3530.12 86 3514 69.8822 3514 50C3514 30.1177 3530.12 14 3550 14C3569.88 14 3586 30.1177 3586 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask1)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3540.73 37.7468C3540.19 42.546 3538.12 46.3428 3536.64 49.0622L3536.6 49.1388L3532.97 52.7418L3541.91 66.4697L3545.08 65.9169C3546.35 65.6237 3547.82 65.5667 3549.43 65.5042C3552.62 65.3806 3556.37 65.2354 3560.18 63.1954C3560.19 63.1889 3560.21 63.1824 3560.22 63.1757L3569.2 58.3386C3571.02 57.359 3571.7 55.0903 3570.72 53.2712C3570.22 52.339 3569.38 51.7058 3568.43 51.4417C3569.44 50.2012 3569.66 48.4302 3568.86 46.937C3568.3 45.9026 3567.36 45.2057 3566.31 44.9268C3567.4 43.6824 3567.66 41.8449 3566.83 40.3033C3566.29 39.3021 3565.39 38.617 3564.38 38.3212C3565.46 37.1809 3565.75 35.43 3564.96 33.9691C3563.98 32.15 3561.71 31.4694 3559.89 32.4489L3550.91 37.2861C3550.26 37.6376 3549.75 38.155 3549.42 38.7581C3549.15 37.5351 3548.3 34.5808 3546.79 31.781C3544.85 28.1878 3541.26 25.1013 3539.19 26.9901C3538.14 27.9413 3538.69 29.3073 3539.42 31.1116C3540.14 32.89 3541.03 35.0942 3540.73 37.7468Z"
                fill="white"
            />
            <path
                d="M3506.94 64.1489C3505.64 61.7344 3506.55 58.723 3508.96 57.4228L3528.4 46.9584C3530.81 45.6582 3533.82 46.5616 3535.12 48.9762L3544.99 67.2983C3546.29 69.7129 3545.38 72.7243 3542.97 74.0245L3523.54 84.4889C3521.12 85.7891 3518.11 84.8857 3516.81 82.4711L3506.94 64.1489Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3529.57 49.1444L3510.14 59.6088C3508.93 60.2589 3508.48 61.7646 3509.13 62.9718L3519 81.294C3519.65 82.5013 3521.15 82.953 3522.36 82.3029L3541.79 71.8385C3543 71.1884 3543.45 69.6827 3542.8 68.4754L3532.94 50.1533C3532.29 48.946 3530.78 48.4943 3529.57 49.1444ZM3508.96 57.4228C3506.55 58.723 3505.64 61.7344 3506.94 64.1489L3516.81 82.4711C3518.11 84.8857 3521.12 85.7891 3523.54 84.4889L3542.97 74.0245C3545.38 72.7243 3546.29 69.7129 3544.99 67.2983L3535.12 48.9762C3533.82 46.5616 3530.81 45.6582 3528.4 46.9584L3508.96 57.4228Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3524.29 50.3447C3524.9 50.0196 3525.65 50.2455 3525.98 50.8491L3529.08 56.6127C3529.4 57.2163 3529.18 57.9691 3528.57 58.2942C3527.97 58.6192 3527.22 58.3934 3526.89 57.7898L3523.79 52.0262C3523.46 51.4226 3523.69 50.6697 3524.29 50.3447Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3530.16 61.2315C3530.76 60.9065 3531.51 61.1323 3531.84 61.736L3538.39 73.9034C3538.71 74.5071 3538.49 75.2599 3537.88 75.585C3537.28 75.91 3536.53 75.6842 3536.2 75.0805L3529.65 62.9131C3529.33 62.3094 3529.55 61.5566 3530.16 61.2315Z"
                fill={color}
            />
        </g>
        <mask id="mask2" mask-type="alpha" maskUnits="userSpaceOnUse" x="3614" y="14" width="72" height="72">
            <path
                d="M3686 50C3686 69.8822 3669.88 86 3650 86C3630.12 86 3614 69.8822 3614 50C3614 30.1177 3630.12 14 3650 14C3669.88 14 3686 30.1177 3686 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask2)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3640.3 37.6631C3639.9 42.4762 3637.94 46.3327 3636.54 49.0948L3636.5 49.1726L3632.98 52.8816L3642.32 66.3386L3645.48 65.6917C3646.74 65.3612 3648.21 65.2606 3649.82 65.1504C3653.01 64.9322 3656.75 64.676 3660.49 62.524C3660.51 62.5172 3660.52 62.5102 3660.53 62.5032L3669.37 57.4019C3671.16 56.3689 3671.77 54.0809 3670.74 52.2917C3670.21 51.3748 3669.35 50.7668 3668.39 50.5308C3669.36 49.2611 3669.53 47.4843 3668.68 46.0156C3668.1 44.9982 3667.14 44.3294 3666.08 44.0818C3667.13 42.8057 3667.34 40.9612 3666.46 39.4449C3665.89 38.4601 3664.97 37.8019 3663.95 37.5362C3665 36.3643 3665.24 34.6057 3664.41 33.1688C3663.37 31.3795 3661.09 30.7665 3659.3 31.7995L3650.46 36.9008C3649.82 37.2715 3649.33 37.8037 3649.01 38.4165C3648.71 37.2018 3647.77 34.2743 3646.18 31.5204C3644.14 27.9861 3640.45 25.0075 3638.44 26.9569C3637.42 27.9386 3638.01 29.2877 3638.79 31.0696C3639.56 32.826 3640.52 35.0029 3640.3 37.6631Z"
                fill="white"
            />
            <path
                d="M3607.31 65.0551C3605.94 62.6802 3606.75 59.6433 3609.13 58.2721L3628.24 47.2363C3630.62 45.8651 3633.65 46.6788 3635.02 49.0538L3645.43 67.0755C3646.8 69.4504 3645.99 72.4873 3643.61 73.8585L3624.5 84.8943C3622.12 86.2655 3619.08 85.4518 3617.71 83.0768L3607.31 65.0551Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3629.48 49.3864L3610.37 60.4223C3609.18 61.1079 3608.77 62.6263 3609.46 63.8138L3619.86 81.8354C3620.55 83.0229 3622.07 83.4298 3623.26 82.7442L3642.37 71.7083C3643.56 71.0228 3643.96 69.5043 3643.28 68.3168L3632.87 50.2952C3632.19 49.1077 3630.67 48.7008 3629.48 49.3864ZM3609.13 58.2721C3606.75 59.6433 3605.94 62.6802 3607.31 65.0551L3617.71 83.0768C3619.08 85.4518 3622.12 86.2655 3624.5 84.8943L3643.61 73.8585C3645.99 72.4873 3646.8 69.4504 3645.43 67.0755L3635.02 49.0538C3633.65 46.6788 3630.62 45.8651 3628.24 47.2363L3609.13 58.2721Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3624.24 50.7427C3624.84 50.3999 3625.6 50.6033 3625.94 51.1971L3629.21 56.8661C3629.55 57.4598 3629.35 58.2191 3628.76 58.5618C3628.16 58.9046 3627.4 58.7012 3627.06 58.1075L3623.79 52.4385C3623.44 51.8447 3623.65 51.0855 3624.24 50.7427Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3630.42 61.4511C3631.02 61.1083 3631.78 61.3117 3632.12 61.9055L3639.03 73.8734C3639.37 74.4671 3639.17 75.2263 3638.58 75.5691C3637.98 75.9119 3637.22 75.7085 3636.88 75.1147L3629.97 63.1468C3629.63 62.5531 3629.83 61.7939 3630.42 61.4511Z"
                fill={color}
            />
        </g>
        <mask id="mask3" mask-type="alpha" maskUnits="userSpaceOnUse" x="3314" y="14" width="72" height="72">
            <path
                d="M3386 50C3386 69.8822 3369.88 86 3350 86C3330.12 86 3314 69.8822 3314 50C3314 30.1177 3330.12 14 3350 14C3369.88 14 3386 30.1177 3386 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask3)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3340.3 37.6631C3339.9 42.4762 3337.94 46.3327 3336.54 49.0948L3336.5 49.1726L3332.98 52.8816L3342.32 66.3386L3345.48 65.6917C3346.74 65.3612 3348.21 65.2606 3349.82 65.1504C3353.01 64.9322 3356.75 64.676 3360.49 62.524C3360.51 62.5172 3360.52 62.5102 3360.53 62.5032L3369.37 57.4019C3371.16 56.3689 3371.77 54.0809 3370.74 52.2917C3370.21 51.3748 3369.35 50.7668 3368.39 50.5308C3369.36 49.2611 3369.53 47.4843 3368.68 46.0156C3368.1 44.9982 3367.14 44.3294 3366.08 44.0818C3367.13 42.8057 3367.34 40.9612 3366.46 39.4449C3365.89 38.4601 3364.97 37.8019 3363.95 37.5362C3365 36.3643 3365.24 34.6057 3364.41 33.1688C3363.37 31.3795 3361.09 30.7665 3359.3 31.7995L3350.46 36.9008C3349.82 37.2715 3349.33 37.8037 3349.01 38.4165C3348.71 37.2018 3347.77 34.2743 3346.18 31.5204C3344.14 27.9861 3340.45 25.0075 3338.44 26.9569C3337.42 27.9386 3338.01 29.2877 3338.79 31.0696C3339.56 32.826 3340.52 35.0029 3340.3 37.6631Z"
                fill="white"
            />
            <path
                d="M3307.31 65.0551C3305.94 62.6802 3306.75 59.6433 3309.13 58.2721L3328.24 47.2363C3330.62 45.8651 3333.65 46.6788 3335.02 49.0538L3345.43 67.0755C3346.8 69.4504 3345.99 72.4873 3343.61 73.8585L3324.5 84.8943C3322.12 86.2655 3319.08 85.4518 3317.71 83.0768L3307.31 65.0551Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3329.48 49.3864L3310.37 60.4223C3309.18 61.1079 3308.77 62.6263 3309.46 63.8138L3319.86 81.8354C3320.55 83.0229 3322.07 83.4298 3323.26 82.7442L3342.37 71.7083C3343.56 71.0228 3343.96 69.5043 3343.28 68.3168L3332.87 50.2952C3332.19 49.1077 3330.67 48.7008 3329.48 49.3864ZM3309.13 58.2721C3306.75 59.6433 3305.94 62.6802 3307.31 65.0551L3317.71 83.0768C3319.08 85.4518 3322.12 86.2655 3324.5 84.8943L3343.61 73.8585C3345.99 72.4873 3346.8 69.4504 3345.43 67.0755L3335.02 49.0538C3333.65 46.6788 3330.62 45.8651 3328.24 47.2363L3309.13 58.2721Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3324.24 50.7427C3324.84 50.3999 3325.6 50.6033 3325.94 51.1971L3329.21 56.8661C3329.55 57.4598 3329.35 58.2191 3328.76 58.5618C3328.16 58.9046 3327.4 58.7012 3327.06 58.1075L3323.79 52.4385C3323.44 51.8447 3323.65 51.0855 3324.24 50.7427Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3330.42 61.4511C3331.02 61.1083 3331.78 61.3117 3332.12 61.9055L3339.03 73.8734C3339.37 74.4671 3339.17 75.2263 3338.58 75.5691C3337.98 75.9119 3337.22 75.7085 3336.88 75.1147L3329.97 63.1468C3329.63 62.5531 3329.83 61.7939 3330.42 61.4511Z"
                fill={color}
            />
        </g>
        <mask id="mask4" mask-type="alpha" maskUnits="userSpaceOnUse" x="3214" y="14" width="72" height="72">
            <path
                d="M3286 50C3286 69.8822 3269.88 86 3250 86C3230.12 86 3214 69.8822 3214 50C3214 30.1177 3230.12 14 3250 14C3269.88 14 3286 30.1177 3286 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask4)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3238.12 35.5018C3238.11 40.331 3236.47 44.3316 3235.29 47.1969L3235.26 47.2776L3232.05 51.2558L3242.43 63.9238L3245.53 63.0266C3246.76 62.5967 3248.21 62.3792 3249.81 62.1407C3252.97 61.6688 3256.67 61.1148 3260.24 58.6702C3260.25 58.6624 3260.26 58.6545 3260.27 58.6466L3268.67 52.8559C3270.37 51.6832 3270.8 49.3536 3269.63 47.6526C3269.03 46.7809 3268.12 46.2434 3267.16 46.0843C3268.02 44.7414 3268.05 42.9568 3267.08 41.5605C3266.42 40.5932 3265.41 40.0032 3264.33 39.8411C3265.28 38.4851 3265.34 36.6298 3264.34 35.1884C3263.7 34.2521 3262.73 33.6692 3261.69 33.4858C3262.65 32.2338 3262.74 30.4623 3261.79 29.0962C3260.62 27.3952 3258.29 26.9668 3256.59 28.1395L3248.19 33.9302C3247.58 34.3509 3247.13 34.9207 3246.87 35.5568C3246.47 34.37 3245.29 31.5273 3243.49 28.9092C3241.17 25.5491 3237.26 22.8742 3235.41 24.9784C3234.48 26.0381 3235.17 27.3357 3236.09 29.0496C3237 30.7388 3238.13 32.8326 3238.12 35.5018Z"
                fill="white"
            />
            <path
                d="M3207.43 65.4411C3205.87 63.1833 3206.44 60.0911 3208.7 58.5346L3226.87 46.0074C3229.13 44.4509 3232.22 45.0195 3233.77 47.2773L3245.59 64.4104C3247.14 66.6682 3246.57 69.7604 3244.32 71.3169L3226.14 83.8441C3223.89 85.4006 3220.79 84.832 3219.24 82.5742L3207.43 65.4411Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3228.28 48.0515L3210.1 60.5787C3208.98 61.357 3208.69 62.9031 3209.47 64.032L3221.28 81.165C3222.06 82.294 3223.61 82.5783 3224.73 81.8L3242.91 69.2728C3244.04 68.4945 3244.32 66.9484 3243.54 65.8195L3231.73 48.6865C3230.95 47.5575 3229.41 47.2732 3228.28 48.0515ZM3208.7 58.5346C3206.44 60.0911 3205.87 63.1833 3207.43 65.4411L3219.24 82.5742C3220.79 84.832 3223.89 85.4006 3226.14 83.8441L3244.32 71.3169C3246.57 69.7604 3247.14 66.6682 3245.59 64.4104L3233.77 47.2773C3232.22 45.0195 3229.13 44.4509 3226.87 46.0074L3208.7 58.5346Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3223.16 49.822C3223.73 49.4329 3224.5 49.5751 3224.89 50.1395L3228.6 55.529C3228.99 56.0935 3228.85 56.8665 3228.29 57.2556C3227.72 57.6448 3226.95 57.5026 3226.56 56.9381L3222.84 51.5487C3222.45 50.9842 3222.6 50.2112 3223.16 49.822Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3230.18 60.0025C3230.74 59.6133 3231.52 59.7555 3231.91 60.3199L3239.75 71.6977C3240.14 72.2622 3240 73.0352 3239.43 73.4244C3238.87 73.8135 3238.09 73.6713 3237.7 73.1069L3229.86 61.7291C3229.47 61.1646 3229.61 60.3916 3230.18 60.0025Z"
                fill={color}
            />
        </g>
        <mask id="mask5" mask-type="alpha" maskUnits="userSpaceOnUse" x="3114" y="14" width="72" height="72">
            <path
                d="M3186 50C3186 69.8822 3169.88 86 3150 86C3130.12 86 3114 69.8822 3114 50C3114 30.1177 3130.12 14 3150 14C3169.88 14 3186 30.1177 3186 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask5)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3129.15 32.443C3129.78 37.231 3128.68 41.414 3127.89 44.4099L3127.87 44.4943L3125.21 48.8627L3137.19 60.0442L3140.14 58.7446C3141.3 58.1562 3142.71 57.7479 3144.26 57.3002C3147.33 56.4143 3150.93 55.3742 3154.14 52.4792C3154.15 52.4699 3154.16 52.4606 3154.17 52.4512L3161.73 45.5993C3163.26 44.2117 3163.38 41.8459 3161.99 40.3151C3161.28 39.5307 3160.31 39.1177 3159.33 39.0882C3160.01 37.6428 3159.8 35.8705 3158.66 34.6139C3157.87 33.7435 3156.79 33.2923 3155.7 33.2742C3156.46 31.8048 3156.27 29.958 3155.1 28.6607C3154.34 27.8182 3153.3 27.3684 3152.25 27.3241C3153.03 25.9568 3152.88 24.1889 3151.77 22.9596C3150.38 21.4287 3148.01 21.3126 3146.48 22.7001L3138.92 29.552C3138.37 30.0499 3138.01 30.6737 3137.83 31.3397C3137.28 30.2157 3135.74 27.5537 3133.6 25.1976C3130.86 22.1739 3126.63 20.0401 3125.07 22.3712C3124.29 23.5452 3125.15 24.7391 3126.29 26.316C3127.41 27.8702 3128.8 29.7966 3129.15 32.443Z"
                fill="white"
            />
            <path
                d="M3102.69 66.1828C3100.85 64.1508 3101 61.0106 3103.03 59.1689L3119.39 44.346C3121.42 42.5042 3124.56 42.6584 3126.4 44.6903L3140.38 60.1087C3142.22 62.1407 3142.06 65.2809 3140.03 67.1226L3123.68 81.9455C3121.65 83.7873 3118.51 83.6331 3116.66 81.6012L3102.69 66.1828Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3121.05 46.1855L3104.7 61.0085C3103.69 61.9293 3103.61 63.4994 3104.53 64.5154L3118.5 79.9338C3119.43 80.9498 3121 81.0269 3122.01 80.106L3138.36 65.2831C3139.38 64.3622 3139.46 62.7921 3138.54 61.7761L3124.56 46.3577C3123.64 45.3417 3122.07 45.2646 3121.05 46.1855ZM3103.03 59.1689C3101 61.0106 3100.85 64.1508 3102.69 66.1828L3116.66 81.6012C3118.51 83.6331 3121.65 83.7873 3123.68 81.9455L3140.03 67.1226C3142.06 65.2809 3142.22 62.1407 3140.38 60.1087L3126.4 44.6903C3124.56 42.6584 3121.42 42.5042 3119.39 44.346L3103.03 59.1689Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3116.22 48.6178C3116.73 48.1574 3117.51 48.196 3117.97 48.7039L3122.37 53.5541C3122.83 54.062 3122.79 54.8471 3122.28 55.3075C3121.77 55.768 3120.99 55.7294 3120.53 55.2214L3116.13 50.3713C3115.67 49.8633 3115.71 49.0783 3116.22 48.6178Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3124.52 57.7795C3125.03 57.319 3125.82 57.3576 3126.28 57.8656L3135.56 68.1047C3136.02 68.6127 3135.98 69.3977 3135.47 69.8582C3134.96 70.3186 3134.18 70.2801 3133.72 69.7721L3124.44 59.5329C3123.98 59.025 3124.01 58.2399 3124.52 57.7795Z"
                fill={color}
            />
        </g>
        <mask id="mask6" mask-type="alpha" maskUnits="userSpaceOnUse" x="3014" y="14" width="72" height="72">
            <path
                d="M3086 50C3086 69.8822 3069.88 86 3050 86C3030.12 86 3014 69.8822 3014 50C3014 30.1177 3030.12 14 3050 14C3069.88 14 3086 30.1177 3086 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask6)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3011.37 19.4973C3012.72 24.1347 3012.27 28.4359 3011.94 31.5165L3011.93 31.6033L3009.97 36.3236L3023.49 45.5634L3026.22 43.8316C3027.27 43.0747 3028.61 42.457 3030.07 41.7797C3032.97 40.4394 3036.37 38.8658 3039.11 35.5182C3039.12 35.5075 3039.13 35.4967 3039.14 35.4858L3045.57 27.5682C3046.87 25.9648 3046.63 23.6087 3045.03 22.3057C3044.2 21.638 3043.19 21.3763 3042.21 21.4957C3042.66 19.9644 3042.19 18.2444 3040.87 17.1747C3039.96 16.4338 3038.82 16.1512 3037.74 16.2981C3038.27 14.7309 3037.81 12.9335 3036.45 11.8293C3035.57 11.1121 3034.47 10.8243 3033.43 10.94C3033.99 9.47048 3033.58 7.74486 3032.29 6.69839C3030.69 5.39534 3028.33 5.63878 3027.03 7.24213L3020.6 15.1597C3020.13 15.735 3019.86 16.4072 3019.78 17.0929C3019.07 16.0651 3017.14 13.6673 3014.67 11.6617C3011.51 9.08787 3007 7.6191 3005.81 10.1594C3005.22 11.4388 3006.25 12.4882 3007.61 13.8744C3008.96 15.2407 3010.63 16.9341 3011.37 19.4973Z"
                fill="white"
            />
            <path
                d="M2990.33 56.8551C2988.2 55.1255 2987.87 51.9982 2989.6 49.87L3003.52 32.7416C3005.25 30.6134 3008.38 30.2903 3010.51 32.0199L3026.66 45.1443C3028.79 46.8739 3029.11 50.0012 3027.38 52.1294L3013.46 69.2578C3011.73 71.386 3008.6 71.7091 3006.47 69.9795L2990.33 56.8551Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3005.45 34.3075L2991.53 51.4358C2990.67 52.4999 2990.83 54.0636 2991.89 54.9284L3008.04 68.0528C3009.1 68.9176 3010.67 68.756 3011.53 67.6919L3025.45 50.5636C3026.32 49.4995 3026.16 47.9358 3025.09 47.071L3008.94 33.9466C3007.88 33.0818 3006.32 33.2434 3005.45 34.3075ZM2989.6 49.87C2987.87 51.9982 2988.2 55.1255 2990.33 56.8551L3006.47 69.9795C3008.6 71.7091 3011.73 71.386 3013.46 69.2578L3027.38 52.1294C3029.11 50.0012 3028.79 46.8739 3026.66 45.1443L3010.51 32.0199C3008.38 30.2903 3005.25 30.6134 3003.52 32.7416L2989.6 49.87Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3010.63 45.2425C3011.07 44.7104 3011.85 44.6296 3012.38 45.062L3023.1 53.7777C3023.64 54.2101 3023.72 54.992 3023.28 55.524C3022.85 56.0561 3022.07 56.1368 3021.54 55.7044L3010.81 46.9887C3010.28 46.5563 3010.2 45.7745 3010.63 45.2425Z"
                fill={color}
            />
        </g>
        <mask id="mask7" mask-type="alpha" maskUnits="userSpaceOnUse" x="3414" y="14" width="72" height="72">
            <path
                d="M3486 50C3486 69.8822 3469.88 86 3450 86C3430.12 86 3414 69.8822 3414 50C3414 30.1177 3430.12 14 3450 14C3469.88 14 3486 30.1177 3486 50Z"
                fill="#E7E7E7"
            />
        </mask>
        <g mask="url(#mask7)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3441.28 37.873C3440.56 42.6483 3438.35 46.3634 3436.76 49.0243L3436.72 49.0992L3432.95 52.5614L3441.36 66.6198L3444.56 66.1885C3445.84 65.9437 3447.31 65.9428 3448.92 65.9417C3452.11 65.9397 3455.86 65.9374 3459.75 64.0441C3459.76 64.038 3459.77 64.0319 3459.79 64.0258L3468.95 59.5343C3470.8 58.6247 3471.57 56.3836 3470.66 54.5285C3470.19 53.5779 3469.38 52.9131 3468.44 52.6132C3469.49 51.4118 3469.78 49.6506 3469.04 48.1278C3468.52 47.073 3467.61 46.3408 3466.57 46.022C3467.7 44.82 3468.03 42.9938 3467.26 41.4218C3466.76 40.4007 3465.89 39.6819 3464.89 39.3478C3466.02 38.2496 3466.37 36.5108 3465.64 35.021C3464.73 33.1659 3462.49 32.3994 3460.63 33.309L3451.47 37.8004C3450.81 38.1268 3450.28 38.6246 3449.92 39.2145C3449.71 37.9823 3448.96 34.9975 3447.56 32.1423C3445.77 28.478 3442.29 25.2569 3440.15 27.0653C3439.07 27.9761 3439.57 29.3621 3440.23 31.1928C3440.88 32.9972 3441.68 35.2337 3441.28 37.873Z"
                fill="white"
            />
            <path
                d="M3406.51 62.969C3405.31 60.5066 3406.32 57.5318 3408.79 56.3245L3428.6 46.608C3431.07 45.4007 3434.04 46.4181 3435.25 48.8805L3444.41 67.5651C3445.62 70.0275 3444.6 73.0023 3442.14 74.2096L3422.32 83.9261C3419.86 85.1334 3416.88 84.116 3415.68 81.6536L3406.51 62.969Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3429.7 48.8372L3409.88 58.5538C3408.65 59.1574 3408.14 60.6448 3408.74 61.876L3417.9 80.5606C3418.51 81.7918 3420 82.3005 3421.23 81.6969L3441.04 71.9803C3442.28 71.3767 3442.78 69.8893 3442.18 68.6581L3433.02 49.9735C3432.42 48.7423 3430.93 48.2336 3429.7 48.8372ZM3408.79 56.3245C3406.32 57.5318 3405.31 60.5066 3406.51 62.969L3415.68 81.6536C3416.88 84.116 3419.86 85.1334 3422.32 83.9261L3442.14 74.2096C3444.6 73.0023 3445.62 70.0275 3444.41 67.5651L3435.25 48.8805C3434.04 46.4181 3431.07 45.4007 3428.6 46.608L3408.79 56.3245Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3424.38 49.8357C3424.99 49.5339 3425.74 49.7883 3426.04 50.4038L3428.92 56.2814C3429.22 56.897 3428.97 57.6407 3428.35 57.9425C3427.74 58.2443 3426.99 57.99 3426.69 57.3744L3423.81 51.4968C3423.51 50.8812 3423.76 50.1375 3424.38 49.8357Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3429.82 60.9379C3430.44 60.6361 3431.18 60.8904 3431.48 61.506L3437.56 73.9142C3437.87 74.5298 3437.61 75.2735 3437 75.5753C3436.38 75.8771 3435.64 75.6228 3435.34 75.0072L3429.25 62.599C3428.95 61.9834 3429.2 61.2397 3429.82 60.9379Z"
                fill={color}
            />
        </g>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3550 83.5172C3568.51 83.5172 3583.52 68.5111 3583.52 50C3583.52 31.4889 3568.51 16.4828 3550 16.4828C3531.49 16.4828 3516.48 31.4889 3516.48 50C3516.48 68.5111 3531.49 83.5172 3550 83.5172ZM3550 86C3569.88 86 3586 69.8822 3586 50C3586 30.1177 3569.88 14 3550 14C3530.12 14 3514 30.1177 3514 50C3514 69.8822 3530.12 86 3550 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3650 83.5172C3668.51 83.5172 3683.52 68.5111 3683.52 50C3683.52 31.4889 3668.51 16.4828 3650 16.4828C3631.49 16.4828 3616.48 31.4889 3616.48 50C3616.48 68.5111 3631.49 83.5172 3650 83.5172ZM3650 86C3669.88 86 3686 69.8822 3686 50C3686 30.1177 3669.88 14 3650 14C3630.12 14 3614 30.1177 3614 50C3614 69.8822 3630.12 86 3650 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3350 83.5172C3368.51 83.5172 3383.52 68.5111 3383.52 50C3383.52 31.4889 3368.51 16.4828 3350 16.4828C3331.49 16.4828 3316.48 31.4889 3316.48 50C3316.48 68.5111 3331.49 83.5172 3350 83.5172ZM3350 86C3369.88 86 3386 69.8822 3386 50C3386 30.1177 3369.88 14 3350 14C3330.12 14 3314 30.1177 3314 50C3314 69.8822 3330.12 86 3350 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3250 83.5172C3268.51 83.5172 3283.52 68.5111 3283.52 50C3283.52 31.4889 3268.51 16.4828 3250 16.4828C3231.49 16.4828 3216.48 31.4889 3216.48 50C3216.48 68.5111 3231.49 83.5172 3250 83.5172ZM3250 86C3269.88 86 3286 69.8822 3286 50C3286 30.1177 3269.88 14 3250 14C3230.12 14 3214 30.1177 3214 50C3214 69.8822 3230.12 86 3250 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3150 83.5172C3168.51 83.5172 3183.52 68.5111 3183.52 50C3183.52 31.4889 3168.51 16.4828 3150 16.4828C3131.49 16.4828 3116.48 31.4889 3116.48 50C3116.48 68.5111 3131.49 83.5172 3150 83.5172ZM3150 86C3169.88 86 3186 69.8822 3186 50C3186 30.1177 3169.88 14 3150 14C3130.12 14 3114 30.1177 3114 50C3114 69.8822 3130.12 86 3150 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3050 83.5172C3068.51 83.5172 3083.52 68.5111 3083.52 50C3083.52 31.4889 3068.51 16.4828 3050 16.4828C3031.49 16.4828 3016.48 31.4889 3016.48 50C3016.48 68.5111 3031.49 83.5172 3050 83.5172ZM3050 86C3069.88 86 3086 69.8822 3086 50C3086 30.1177 3069.88 14 3050 14C3030.12 14 3014 30.1177 3014 50C3014 69.8822 3030.12 86 3050 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2950 83.5172C2968.51 83.5172 2983.52 68.5111 2983.52 50C2983.52 31.4889 2968.51 16.4828 2950 16.4828C2931.49 16.4828 2916.48 31.4889 2916.48 50C2916.48 68.5111 2931.49 83.5172 2950 83.5172ZM2950 86C2969.88 86 2986 69.8822 2986 50C2986 30.1177 2969.88 14 2950 14C2930.12 14 2914 30.1177 2914 50C2914 69.8822 2930.12 86 2950 86Z"
            fill="white"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3450 83.5172C3468.51 83.5172 3483.52 68.5111 3483.52 50C3483.52 31.4889 3468.51 16.4828 3450 16.4828C3431.49 16.4828 3416.48 31.4889 3416.48 50C3416.48 68.5111 3431.49 83.5172 3450 83.5172ZM3450 86C3469.88 86 3486 69.8822 3486 50C3486 30.1177 3469.88 14 3450 14C3430.12 14 3414 30.1177 3414 50C3414 69.8822 3430.12 86 3450 86Z"
            fill="white"
        />
        <circle cx="2750" cy="50" r="36" fill="white" />
        <circle cx="2850" cy="50" r="36" fill="white" />
        <circle cx="2750" cy="50" r="18" fill={color} />
        <circle cx="2850" cy="50" r="27" fill={color} />
        <circle cx="2550" cy="50" r="40" fill={color} />
        <circle cx="2550" cy="50" r="38" fill="white" />
        <circle cx="2650" cy="50" r="40" fill="white" />
        <g opacity="0.2">
            <circle cx="2546" cy="15" r="1" fill="white" fillOpacity="0.4" />
            <circle cx="2554" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.1">
            <circle cx="2646" cy="15" r="1" fill="white" fillOpacity="0.4" />
            <circle cx="2654" cy="8" r="1" fill={color} />
        </g>
        <g opacity="0.2">
            <ellipse cx="2555" cy="85" rx="1" ry="1" transform="rotate(-180 2555 85)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2547" cy="93" rx="1" ry="1" transform="rotate(-180 2547 93)" fill={color} />
        </g>
        <g opacity="0.1">
            <ellipse cx="2655" cy="85" rx="1" ry="1" transform="rotate(-180 2655 85)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2647" cy="93" rx="1" ry="1" transform="rotate(-180 2647 93)" fill={color} />
        </g>
        <g opacity="0.2">
            <ellipse cx="2585" cy="46" rx="1" ry="1" transform="rotate(90 2585 46)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2592" cy="53" rx="1" ry="1" transform="rotate(90 2592 53)" fill={color} />
        </g>
        <g opacity="0.1">
            <ellipse cx="2685" cy="46" rx="1" ry="1" transform="rotate(90 2685 46)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2692" cy="53" rx="1" ry="1" transform="rotate(90 2692 53)" fill={color} />
        </g>
        <g opacity="0.2">
            <ellipse cx="2515" cy="54" rx="1" ry="1" transform="rotate(-90 2515 54)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2508" cy="47" rx="1" ry="1" transform="rotate(-90 2508 47)" fill={color} />
        </g>
        <g opacity="0.1">
            <ellipse cx="2615" cy="54" rx="1" ry="1" transform="rotate(-90 2615 54)" fill="white" fillOpacity="0.4" />
            <ellipse cx="2608" cy="47" rx="1" ry="1" transform="rotate(-90 2608 47)" fill={color} />
        </g>
        <g opacity="0.2">
            <circle
                cx="2522.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2522.07 28.2261)"
                fill="white"
                fillOpacity="0.4"
            />
            <circle cx="2522.78" cy="17.6195" r="1" transform="rotate(-45 2522.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.1">
            <circle
                cx="2622.07"
                cy="28.2261"
                r="1"
                transform="rotate(-45 2622.07 28.2261)"
                fill="white"
                fillOpacity="0.4"
            />
            <circle cx="2622.78" cy="17.6195" r="1" transform="rotate(-45 2622.78 17.6195)" fill={color} />
        </g>
        <g opacity="0.2">
            <ellipse
                cx="2577.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2577.93 71.3596)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2577.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2577.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.1">
            <ellipse
                cx="2677.93"
                cy="71.3596"
                rx="1"
                ry="1"
                transform="rotate(135 2677.93 71.3596)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2677.93" cy="82.6733" rx="1" ry="1" transform="rotate(135 2677.93 82.6733)" fill={color} />
        </g>
        <g opacity="0.2">
            <ellipse
                cx="2571.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2571.57 22.5692)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2581.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2581.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.1">
            <ellipse
                cx="2671.57"
                cy="22.5692"
                rx="1"
                ry="1"
                transform="rotate(45 2671.57 22.5692)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2681.47" cy="22.5692" rx="1" ry="1" transform="rotate(45 2681.47 22.5692)" fill={color} />
        </g>
        <g opacity="0.2">
            <ellipse
                cx="2527.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2527.73 77.7236)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2517.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2517.83 77.7236)" fill={color} />
        </g>
        <g opacity="0.1">
            <ellipse
                cx="2627.73"
                cy="77.7236"
                rx="1"
                ry="1"
                transform="rotate(-135 2627.73 77.7236)"
                fill="white"
                fillOpacity="0.4"
            />
            <ellipse cx="2617.83" cy="77.7236" rx="1" ry="1" transform="rotate(-135 2617.83 77.7236)" fill={color} />
        </g>
    </svg>
)

export default Like
