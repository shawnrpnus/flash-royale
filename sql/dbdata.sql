--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.14
-- Dumped by pg_dump version 9.5.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: apparel; Type: TABLE; Schema: public; Owner: flash
--

CREATE TABLE public.apparel (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    brand character varying(128) NOT NULL,
    manufacturer character varying(128) NOT NULL,
    style character varying(64) NOT NULL,
    color character varying(64) NOT NULL,
    size character varying(8) NOT NULL,
    price numeric NOT NULL,
    image character varying(16),
    CONSTRAINT apparel_size_check CHECK (((size)::text = ANY ((ARRAY['3XS'::character varying, '2XS'::character varying, 'XS'::character varying, 'S'::character varying, 'M'::character varying, 'L'::character varying, 'XL'::character varying, '2XL'::character varying, '3XL'::character varying])::text[])))
);


ALTER TABLE public.apparel OWNER TO flash;

--
-- Name: apparel_id_seq; Type: SEQUENCE; Schema: public; Owner: flash
--

CREATE SEQUENCE public.apparel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.apparel_id_seq OWNER TO flash;

--
-- Name: apparel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flash
--

ALTER SEQUENCE public.apparel_id_seq OWNED BY public.apparel.id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: flash
--

CREATE TABLE public.stock (
    quantity numeric NOT NULL,
    location_in_store character varying(128) NOT NULL,
    store_name character varying(128) NOT NULL,
    apparel_id integer NOT NULL
);


ALTER TABLE public.stock OWNER TO flash;

--
-- Name: store; Type: TABLE; Schema: public; Owner: flash
--

CREATE TABLE public.store (
    name character varying(128) NOT NULL,
    location character varying(256) NOT NULL
);


ALTER TABLE public.store OWNER TO flash;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.apparel ALTER COLUMN id SET DEFAULT nextval('public.apparel_id_seq'::regclass);


--
-- Data for Name: apparel; Type: TABLE DATA; Schema: public; Owner: flash
--

COPY public.apparel (id, name, brand, manufacturer, style, color, size, price, image) FROM stdin;
1	blouse	h&m	Daniel-Walker	casual	Black	3XL	14.25	image1
2	blouse	h&m	Thompson LLC	casual	Grey	XL	56.25	image2
3	blouse	h&m	Wisoky-Upton	casual	Pink	2XL	85.33	image3
4	blouse	h&m	Ratke, Brekke and Quitzon	casual	Blue	S	23.60	image4
5	jacket	forever 21	Smith, Volkman and Collier	formal	Black	L	64.13	image5
6	hoodie	topshop	Weissnat, Frami and Block	winter	White	L	86.72	image6
7	shorts	topmen	Johns-Oberbrunner	casual	Floral	3XL	85.22	image7
8	shirt	topmen	Frami Inc	spring	Maroon	M	18.05	image8
9	jeans	h&m	Vandervort-Reynolds	fall	Blue	XS	67.62	image9
10	dress	topshop	Jerde, Kris and Kuvalis	casual	Red	S	77.22	image10
11	jacket	topmen	Kuphal, Wunsch and Kautzer	spring	Black	M	17.71	image11
12	shorts	cotton on	Osinski-Von	spring	Green	L	72.78	image12
13	croptop	temt	Dickens Group	casual	Black	3XL	12.50	image13
14	round neck t-shirt	topmen	Connell, Harber and Thiel	casual	Grey	L	49.50	image14
15	shorts	forever 21	McCullough LLC	casual	Fuscia	M	90.05	image15
16	dress	topshop	DuBuque-Lowe	casual	Multi	S	55.25	image16
17	dress	temt	Mraz Inc	summer	Floral	3XL	15.21	image17
18	hoodie	h&m	Schuster-Kohler	fall	Grey	XL	62.09	image18
19	dress	forever 21	Lueilwitz and Sons	winter	Navy	XL	55.09	image19
20	round neck t-shirt	topmen	Walker-McKenzie	summer	Puce	XS	71.92	image20
21	jacket	temt	Kertzmann-Bosco	formal	Indigo	2XL	31.63	image21
22	jeans	temt	Haley-Lueilwitz	summer	Orange	2XL	96.72	image22
23	round neck t-shirt	temt	Block-Mayer	summer	Navy	3XL	63.84	image23
24	jacket	temt	Trantow Inc	spring	Black	3XL	56.07	image24
25	jeans	h&m	Schulist Inc	winter	Blue	XL	63.55	image25
26	shorts	topshop	Reynolds, Oberbrunner and Towne	casual	Mauv	3XL	41.28	image26
27	jacket	forever 21	Turcotte Inc	spring	Khaki	S	16.82	image27
28	hoodie	forever 21	Schaden LLC	fall	Yellow	2XL	60.45	image28
29	jacket	cotton on	Goyette LLC	spring	Navy	XL	37.06	image29
30	jeans	topmen	Steuber-Funk	spring	Denim	XS	23.03	image30
31	skirt	topshop	Shields-Feeney	fall	White	S	61.76	image31
32	shirt	topmen	Schaefer-Feil	formal	Maroon	3XL	20.94	image32
33	dress	temt	Weissnat LLC	winter	Floral	3XL	84.32	image33
34	jeans	forever 21	Kozey-Halvorson	summer	Denim	3XL	91.92	image34
35	round neck t-shirt	topshop	Tillman and Sons	casual	Black	3XL	34.16	image35
36	hoodie	h&m	Schultz LLC	fall	Yellow	L	85.34	image36
37	hoodie	cotton on	Torphy Group	casual	Grey	XL	17.76	image37
38	jacket	h&m	Mayert LLC	spring	Brown	XL	25.19	image38
39	dress	forever 21	Gottlieb Inc	fall	Teal	L	52.56	image39
40	jeans	topmen	Kling Group	spring	Grey	2XL	97.32	image40
41	blouse	cotton on	Tromp-Luettgen	fall	Pink	XS	87.71	image41
42	jeans	temt	Moen, Ruecker and Reynolds	summer	Denim	S	86.65	image42
43	hoodie	topshop	Kuphal-Greenfelder	winter	Grey	S	46.82	image43
44	jacket	topshop	Schumm Inc	spring	Brown	XL	42.57	image44
45	shorts	h&m	Schoen Inc	casual	Denim	3XL	53.17	image45
46	dress	h&m	Buckridge-Wintheiser	spring	Green	2XL	59.89	image46
47	blouse	topshop	Ferry, Gleason and Hara	casual	Pink	XL	83.03	image47
48	jacket	cotton on	Jast-Raynor	casual	Blue	3XL	78.19	image48
49	shorts	topmen	Kirlin-Kassulke	winter	Green	XS	70.82	image49
50	round neck t-shirt	forever 21	Wilkinson LLC	casual	Khaki	S	53.15	image50
\.


--
-- Name: apparel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: flash
--

SELECT pg_catalog.setval('public.apparel_id_seq', 1, false);


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: flash
--

COPY public.stock (quantity, location_in_store, store_name, apparel_id) FROM stdin;
140	JI28	isetan	22
129	CW93	takashimaya	11
249	ST00	topshop	2
133	NK18	cotton on	17
208	TN19	isetan	10
334	KT01	zara	11
152	XK23	forever 21	29
257	KA85	zara	2
375	NF66	uniqlo	9
128	NZ22	h&m	18
126	ZA76	uniqlo	17
248	MF64	topshop	13
142	DQ42	uniqlo	14
198	CQ79	forever 21	33
398	AE51	takashimaya	10
338	WO40	uniqlo	12
394	SJ28	takashimaya	29
379	VM49	forever 21	45
361	ER61	topshop	5
121	NP77	uniqlo	15
103	LC10	forever 21	11
146	YW55	h&m	4
206	EX26	topshop	7
289	RU48	forever 21	42
257	QW81	zara	34
116	KO23	h&m	35
369	BC63	takashimaya	12
213	LX48	forever 21	50
200	GO98	forever 21	43
172	GH27	zara	21
361	UT41	isetan	32
385	HC86	uniqlo	16
395	NK06	forever 21	26
118	DH73	forever 21	1
170	IN58	forever 21	7
162	VR72	zara	12
373	SR31	cotton on	1
383	CU79	takashimaya	18
129	QD66	uniqlo	36
391	OS10	forever 21	32
122	QO06	zara	6
203	GU87	cotton on	33
357	ON93	forever 21	40
289	JU77	zara	23
347	WO80	topshop	16
275	OQ87	forever 21	38
163	QG30	uniqlo	35
245	SP49	h&m	42
134	BW30	isetan	19
192	VU69	zara	3
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: flash
--

COPY public.store (name, location) FROM stdin;
uniqlo	9 Autumn Leaf Point
zara	77 Loftsgordon Lane
forever 21	463 Nancy Crossing
topshop	04 Utah Center
topman	135 Hoepker Street
isetan	4 Fairfield Terrace
cotton on	21996 Jackson Avenue
takashimaya	6 Del Mar Court
h&m	23 New Castle Park
trump tower	7736 Golf Trail
the moon	2613 Ryan Lane
starbucks	61298 Sutteridge Place
com1 basement	3 New Castle Plaza
\.


--
-- Name: apparel_image_key; Type: CONSTRAINT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.apparel
    ADD CONSTRAINT apparel_image_key UNIQUE (image);


--
-- Name: apparel_pkey; Type: CONSTRAINT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.apparel
    ADD CONSTRAINT apparel_pkey PRIMARY KEY (id);


--
-- Name: stock_pkey; Type: CONSTRAINT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (store_name, apparel_id);


--
-- Name: store_pkey; Type: CONSTRAINT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (name);


--
-- Name: stock_apparel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_apparel_id_fkey FOREIGN KEY (apparel_id) REFERENCES public.apparel(id);


--
-- Name: stock_store_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flash
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_store_name_fkey FOREIGN KEY (store_name) REFERENCES public.store(name);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

