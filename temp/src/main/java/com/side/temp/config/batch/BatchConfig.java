/**
 * packageName  : com.side.temp.config.batch
 * fileName     : BatchConfig
 * author       : SangHoon
 * date         : 2026-04-23
 * description  : Batch 환경설정 구성
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-23          SangHoon             최초 생성
 */
package com.side.temp.config.batch;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class BatchConfig {

    private final String JOB_NAME = "testJob";
    private final String STEP_NAME = "testStep";

    /**
     * Job 등록
     * @method       : testJob
     * @author       : SangHoon
     * @date         : 2026-05-01 오후 10:59
     * @param jobRepository
     * @return
     */
    @Bean
    public Job testJob(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new JobBuilder(JOB_NAME, jobRepository)
            .incrementer(new RunIdIncrementer()) // sequential id
            .start(this.testStep(jobRepository, transactionManager)) // step 설정
            .build();
    }

    /**
     * Step 등록
     * @method       : step1
     * @author       : SangHoon
     * @date         : 2026-05-01 오후 11:02
     * @param jobRepository
     * @param transactionManager
     * @return
     */
    @Bean
    @JobScope
    public Step testStep(
        JobRepository jobRepository,
        PlatformTransactionManager transactionManager
    ) {
        return new StepBuilder(STEP_NAME, jobRepository)
            .tasklet(this.testTasklet(), transactionManager)
            .build();
    }

    /**
     * Tasklet: Reader-Processor-Writer를 구분하지 않는 단일 step
     * @method       : testTasklet
     * @author       : SangHoon
     * @date         : 2026-05-01 오후 11:06
     * @return
     */
    @Bean
    @StepScope
    public Tasklet testTasklet() {
        /*return new Tasklet() {
            @Override
            public RepeatStatus execute(
                StepContribution contribution,
                ChunkContext chunkContext
            ) throws Exception {
                return RepeatStatus.FINISHED;   // 작업에 대한 Status 명시
            }
        };*/
        return (contribution, chunkContext) -> RepeatStatus.FINISHED;
    }

}
