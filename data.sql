INSERT INTO categories (
    id, name, icon, image, color_class, description, is_deleted, is_city, area_id, country_id
) VALUES
-- VIETNAM (10 Địa điểm)
('hanoi-vn', 'Hà Nội', 'location_city', 'https://i.pinimg.com/originals/11/a6/50/11a650d0328994784a958e9942a27546.jpg', 'bg-red-500', 'Thủ đô nghìn năm văn hiến.', 0, 1, 'asia', 'vietnam'),
('hcm-vn', 'TP. Hồ Chí Minh', 'apartment', 'https://i.pinimg.com/originals/44/7e/17/447e171b3e4f3a5323908f586940026e.jpg', 'bg-orange-500', 'Thành phố năng động nhất Việt Nam.', 0, 1, 'asia', 'vietnam'),
('da-nang-vn', 'Đà Nẵng', 'beach_access', 'https://i.pinimg.com/originals/8a/7e/39/8a7e39097725916035174549f0322b64.jpg', 'bg-blue-500', 'Thành phố biển với Cầu Vàng nổi tiếng.', 0, 1, 'asia', 'vietnam'),
('hue-vn', 'Huế', 'castle', 'https://i.pinimg.com/originals/e8/36/45/e836458319e349258287532306236b2f.jpg', 'bg-purple-500', 'Cố đô cổ kính với di sản kiến trúc cung đình.', 0, 1, 'asia', 'vietnam'),
('hoi-an-vn', 'Hội An', 'nightlife', 'https://i.pinimg.com/originals/47/4d/81/474d8170845710609a281691316b1778.jpg', 'bg-yellow-500', 'Phố cổ đèn lồng lung linh bên dòng sông Hoài.', 0, 1, 'asia', 'vietnam'),
('da-lat-vn', 'Đà Lạt', 'terrain', 'https://i.pinimg.com/originals/0d/67/6c/0d676cf47228816f1c79326e6d3027f6.jpg', 'bg-green-500', 'Thành phố ngàn hoa với khí hậu ôn đới mát mẻ.', 0, 1, 'asia', 'vietnam'),
('nha-trang-vn', 'Nha Trang', 'pool', 'https://i.pinimg.com/originals/2b/9b/3a/2b9b3a7267f897f646001090333b207a.jpg', 'bg-cyan-500', 'Vịnh biển đẹp bậc nhất thế giới.', 0, 1, 'asia', 'vietnam'),
('ha-long-vn', 'Hạ Long', 'sailing', 'https://i.pinimg.com/originals/f1/9a/9a/f19a9a5f36e6503759a96e8f49845348.jpg', 'bg-emerald-500', 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá.', 0, 1, 'asia', 'vietnam'),
('sapa-vn', 'Sa Pa', 'landscape', 'https://i.pinimg.com/originals/61/8c/9b/618c9b3d0c41097236142c163481498b.jpg', 'bg-slate-500', 'Vùng cao Tây Bắc với ruộng bậc thang hùng vĩ.', 0, 1, 'asia', 'vietnam'),
('phu-quoc-vn', 'Phú Quốc', 'beach_access', 'https://i.pinimg.com/originals/94/3a/0d/943a0d5885c494c50257e8412e7377f0.jpg', 'bg-blue-400', 'Đảo Ngọc với cát trắng và nước biển trong xanh.', 0, 1, 'asia', 'vietnam'),

-- JAPAN (8 Địa điểm)
('tokyo-jp', 'Tokyo', 'nights_stay', 'https://i.pinimg.com/originals/4e/1c/8b/4e1c8b7468641906a281691316b1778c.jpg', 'bg-indigo-500', 'Thủ đô hiện đại và sầm uất.', 0, 1, 'asia', 'japan'),
('osaka-jp', 'Osaka', 'fastfood', 'https://i.pinimg.com/originals/f3/9d/28/f39d2807f4618e95311029497063f915.jpg', 'bg-pink-500', 'Thiên đường ẩm thực và giải trí.', 0, 1, 'asia', 'japan'),
('kyoto-jp', 'Kyoto', 'temple_buddhist', 'https://i.pinimg.com/originals/6d/4e/6a/6d4e6a6e2e28a556d1a1b15c7e39f37c.jpg', 'bg-red-700', 'Trái tim văn hóa truyền thống Nhật Bản.', 0, 1, 'asia', 'japan'),
('sapporo-jp', 'Sapporo', 'ac_unit', 'https://i.pinimg.com/originals/5c/24/7f/5c247f526017a42142278912e989417c.jpg', 'bg-blue-200', 'Thành phố tuyết tuyệt đẹp tại Hokkaido.', 0, 1, 'asia', 'japan'),
('fukuoka-jp', 'Fukuoka', 'ramen_dining', 'https://i.pinimg.com/originals/26/5a/2a/265a2a9129538357f8664633b490f237.jpg', 'bg-orange-400', 'Cửa ngõ miền nam nổi tiếng với món mì Ramen.', 0, 1, 'asia', 'japan'),
('nara-jp', 'Nara', 'pets', 'https://i.pinimg.com/originals/11/a6/f3/11a6f328f40778f65400d72f10279603.jpg', 'bg-green-700', 'Thành phố của những chú nai và đền chùa cổ.', 0, 1, 'asia', 'japan'),
('hiroshima-jp', 'Hiroshima', 'museum', 'https://i.pinimg.com/originals/52/6f/30/526f3089868770b1386766574c86e24f.jpg', 'bg-zinc-500', 'Thành phố biểu tượng cho hòa bình.', 0, 1, 'asia', 'japan'),
('yokohama-jp', 'Yokohama', 'sailing', 'https://i.pinimg.com/originals/99/91/92/99919280388484838c6403d518063032.jpg', 'bg-blue-800', 'Thành phố cảng hiện đại sát vách Tokyo.', 0, 1, 'asia', 'japan'),

-- THAILAND (7 Địa điểm)
('bangkok-th', 'Bangkok', 'temple_hindu', 'https://i.pinimg.com/originals/65/59/3a/65593a65287514302638421873884218.jpg', 'bg-yellow-600', 'Thủ đô sôi động với các đền đài dát vàng.', 0, 1, 'asia', 'thailand'),
('chiang-mai-th', 'Chiang Mai', 'filter_hdr', 'https://i.pinimg.com/originals/d4/0e/63/d40e63375b4306385a86708465710609.jpg', 'bg-green-600', 'Cố đô bình yên vùng Bắc Thái.', 0, 1, 'asia', 'thailand'),
('phuket-th', 'Phuket', 'surfing', 'https://i.pinimg.com/originals/44/c8/10/44c810d29489280d04085609361668c2.jpg', 'bg-cyan-600', 'Hòn đảo lớn nhất và nhộn nhịp nhất Thái Lan.', 0, 1, 'asia', 'thailand'),
('pattaya-th', 'Pattaya', 'nightlife', 'https://i.pinimg.com/originals/e5/23/7f/e5237f0709403d526e38686616422894.jpg', 'bg-pink-400', 'Thành phố biển không ngủ.', 0, 1, 'asia', 'thailand'),
('ayutthaya-th', 'Ayutthaya', 'history', 'https://i.pinimg.com/originals/6a/0c/32/6a0c329883652882195f0072f6a5b786.jpg', 'bg-stone-500', 'Khu di tích kinh đô cổ tráng lệ.', 0, 1, 'asia', 'thailand'),
('krabi-th', 'Krabi', 'kayaking', 'https://i.pinimg.com/originals/44/21/f2/4421f24d9c794246109919f80695034c.jpg', 'bg-teal-500', 'Thiên đường của những vách núi đá vôi sát biển.', 0, 1, 'asia', 'thailand'),
('koh-samui-th', 'Koh Samui', 'beach_access', 'https://i.pinimg.com/originals/83/7d/56/837d568600d39e31005f590409a84a60.jpg', 'bg-blue-300', 'Hòn đảo sang trọng với các resort đẳng cấp.', 0, 1, 'asia', 'thailand'),

-- CHINA (8 Địa điểm)
('beijing-cn', 'Bắc Kinh', 'temple_buddhist', 'https://i.pinimg.com/originals/a1/38/59/a13859d0483863773950f96895317373.jpg', 'bg-red-600', 'Thủ đô lịch sử với Tử Cấm Thành.', 0, 1, 'asia', 'china'),
('shanghai-cn', 'Thượng Hải', 'apartment', 'https://i.pinimg.com/originals/0d/67/6c/0d676cf47228816f1c79326e6d3027f6.jpg', 'bg-blue-900', 'Hòn ngọc viễn đông hiện đại.', 0, 1, 'asia', 'china'),
('xi-an-cn', 'Tây An', 'fort', 'https://i.pinimg.com/originals/39/9b/6d/399b6d88470381669460064972166f21.jpg', 'bg-orange-800', 'Nơi có đội quân đất nung Terracotta.', 0, 1, 'asia', 'china'),
('chengdu-cn', 'Thành Đô', 'pets', 'https://i.pinimg.com/originals/5c/7e/61/5c7e6181f02f90647701783109a1df8a.jpg', 'bg-green-800', 'Quê hương của loài Gấu Trúc.', 0, 1, 'asia', 'china'),
('guangzhou-cn', 'Quảng Châu', 'location_city', 'https://i.pinimg.com/originals/6a/32/3a/6a323a6338902517869601d3698000b1.jpg', 'bg-indigo-600', 'Thành phố cảng sầm uất miền Nam.', 0, 1, 'asia', 'china'),
('hangzhou-cn', 'Hàng Châu', 'nature', 'https://i.pinimg.com/originals/7b/0e/63/7b0e63375b4306385a86708465710609.jpg', 'bg-emerald-400', 'Thiên đường hạ giới với Tây Hồ.', 0, 1, 'asia', 'china'),
('shenzhen-cn', 'Thâm Quyến', 'electric_car', 'https://i.pinimg.com/originals/9d/9e/31/9d9e31998f480356c3677463f2730999.jpg', 'bg-blue-500', 'Thung lũng Silicon của Trung Quốc.', 0, 1, 'asia', 'china'),
('chongqing-cn', 'Trùng Khánh', 'train', 'https://i.pinimg.com/originals/50/6e/8f/506e8f6e729a4358826723f5b5c92c81.jpg', 'bg-red-800', 'Thành phố 3D kỳ ảo bên dòng Trường Giang.', 0, 1, 'asia', 'china'),

-- SOUTH KOREA (5 Địa điểm)
('seoul-kr', 'Seoul', 'festival', 'https://i.pinimg.com/originals/f3/9d/28/f39d2807f4618e95311029497063f915.jpg', 'bg-blue-600', 'Thủ đô năng động của K-Pop.', 0, 1, 'asia', 'south-korea'),
('busan-kr', 'Busan', 'beach_access', 'https://i.pinimg.com/originals/2d/74/4b/2d744b1c7860959074d20915a770020a.jpg', 'bg-blue-400', 'Thành phố cảng lớn nhất Hàn Quốc.', 0, 1, 'asia', 'south-korea'),
('jeju-kr', 'Đảo Jeju', 'landscape', 'https://i.pinimg.com/originals/4a/60/79/4a60799793740e69195977a45638708c.jpg', 'bg-teal-500', 'Hòn đảo của tình yêu và núi lửa.', 0, 1, 'asia', 'south-korea'),
('incheon-kr', 'Incheon', 'flight', 'https://i.pinimg.com/originals/65/58/91/65589139615a97577532675918732152.jpg', 'bg-indigo-300', 'Thành phố sân bay hiện đại.', 0, 1, 'asia', 'south-korea'),
('gyeongju-kr', 'Gyeongju', 'museum', 'https://i.pinimg.com/originals/f5/63/06/f563062356553538421b8492040589da.jpg', 'bg-stone-400', 'Bảo tàng không bức tường.', 0, 1, 'asia', 'south-korea');