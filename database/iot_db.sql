--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1 (Ubuntu 12.1-1.pgdg18.04+1)
-- Dumped by pg_dump version 12.1 (Ubuntu 12.1-1.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: measurement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.measurement (
    id integer NOT NULL,
    measurement_type_id integer NOT NULL,
    sensor_id integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    stop_time timestamp without time zone NOT NULL,
    value double precision NOT NULL
);


ALTER TABLE public.measurement OWNER TO postgres;

--
-- Name: measurement_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.measurement_type (
    id integer NOT NULL,
    name text NOT NULL,
    unit text NOT NULL
);


ALTER TABLE public.measurement_type OWNER TO postgres;

--
-- Name: sensor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    location text NOT NULL,
    status boolean NOT NULL
);


ALTER TABLE public.sensor OWNER TO postgres;

--
-- Name: sensor_measurement_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor_measurement_type (
    id integer NOT NULL,
    sensor_id integer,
    measurement_type_id integer
);


ALTER TABLE public.sensor_measurement_type OWNER TO postgres;

--
-- Data for Name: measurement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.measurement (id, measurement_type_id, sensor_id, start_time, stop_time, value) FROM stdin;
1	1	1	2020-03-14 13:00:00	2020-03-14 13:05:30	23
2	1	2	2020-03-14 13:00:00	2020-03-14 13:05:30	28
3	1	2	2020-03-14 13:15:00	2020-03-14 13:18:30	28
4	1	1	2020-03-14 13:15:00	2020-03-14 13:18:30	25
5	2	1	2020-03-14 13:15:00	2020-03-14 13:18:30	60
6	2	2	2020-03-14 13:15:00	2020-03-14 13:18:30	60
7	3	3	2020-03-14 15:15:00	2020-03-14 15:18:30	5000
8	3	4	2020-03-14 15:15:00	2020-03-14 15:18:30	6000
9	4	5	2020-03-14 15:15:00	2020-03-14 15:18:30	0.3
10	4	6	2020-03-14 15:15:00	2020-03-14 15:18:30	0.3
11	5	7	2020-03-14 15:15:00	2020-03-14 15:18:30	50
12	5	8	2020-03-14 15:15:00	2020-03-14 15:18:30	60
\.


--
-- Data for Name: measurement_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.measurement_type (id, name, unit) FROM stdin;
3	carbon monoxide	ppm
2	humidity	%RH
1	temperature	C
4	PM2.5	μg/m3
5	vibration	Hz
\.


--
-- Data for Name: sensor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensor (id, name, description, location, status) FROM stdin;
1	DHT22	measurement of temperature and humidity	ZPL14 2.12	t
2	DHT22	measurement of temperature and humidity	ZPL14 1.12	t
3	MQ7	measurement of carbon monoxide	ZPL14 1.12	t
4	MQ7	measurement of carbon monoxide	ZPL14 2.12	t
5	PMS5003	measurement of dust, PM2.5	ZPL14 2.12	t
6	PMS5003	measurement of dust, PM2.5	ZPL14 1.12	t
8	DFR Robot Gravity	measurement of vibration	ZPL14 1.12	t
7	DFR Robot Gravity	measurement of vibration	ZPL14 2.12	t
\.


--
-- Data for Name: sensor_measurement_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensor_measurement_type (id, sensor_id, measurement_type_id) FROM stdin;
1	1	1
2	1	2
3	2	1
4	2	2
5	3	3
6	4	3
7	5	4
8	6	4
9	7	5
10	8	5
\.


--
-- Name: measurement measurement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurement
    ADD CONSTRAINT measurement_pkey PRIMARY KEY (id);


--
-- Name: measurement_type measurement_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurement_type
    ADD CONSTRAINT measurement_type_pkey PRIMARY KEY (id);


--
-- Name: sensor_measurement_type sensor_measurement_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_measurement_type
    ADD CONSTRAINT sensor_measurement_type_pkey PRIMARY KEY (id);


--
-- Name: sensor sensor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id);


--
-- Name: measurement fk_measurement_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurement
    ADD CONSTRAINT fk_measurement_type_id FOREIGN KEY (measurement_type_id) REFERENCES public.measurement_type(id);


--
-- Name: sensor_measurement_type fk_measurement_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_measurement_type
    ADD CONSTRAINT fk_measurement_type_id FOREIGN KEY (measurement_type_id) REFERENCES public.measurement_type(id);


--
-- Name: measurement fk_sensor_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurement
    ADD CONSTRAINT fk_sensor_id FOREIGN KEY (sensor_id) REFERENCES public.sensor(id);


--
-- Name: sensor_measurement_type fk_sensor_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_measurement_type
    ADD CONSTRAINT fk_sensor_id FOREIGN KEY (sensor_id) REFERENCES public.sensor(id);


--
-- PostgreSQL database dump complete
--


